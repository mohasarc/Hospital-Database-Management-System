const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../index');
const { USER_TYPES } = require("../../constants");

/****************************************************/
/*                    Appointment                   */
/****************************************************/
// Create an appointment // TODO

// Get all Appointments for a patient
router.get("/", (req, res) => {
	const { p_id } = req.body;
	const sql = `SELECT * FROM doc_visit NATURAL JOIN appointment WHERE p_id='${p_id}'`;

	connection.query(sql, (err, results) => {
		if (err) res.status(200).send(err);
		res.status(200).send(results);
	});
});

/****************************************************/
/*                    Diagnosis                     */
/****************************************************/
// Diagnose the patient
router.post("/disease", async (req, res) => {
	// Prepare values
	const { appt_id, name, description } = req.body;
	const tuple = [appt_id, name, description];

	// Prepare sql
	const testFinalizedSql = `SELECT status
							  FROM assigned_test
							  WHERE appt_id = '${appt_id}'`;
	const sql = `INSERT INTO diagnosis(appt_id, name, description) VALUES (?)`;

	// Retrieve all tests' results for this appointment
	connection.query(testFinalizedSql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			// Check if all tests were finalized
			result.map( (test) => {
				if (test.status != TEST_STATUS.finalized) {
					res.status(500).send("There are some tests that are not yet finalized!");
				} else {
					// finalize diagnozing disease
					connection.query(sql, [tuple], async (err, result) => {
						if (err) {
							res.status(500).send(err);
						} else {
							res.status(200).send(result);
						}
					});
				}
			});
		}
	});
});

// Get the diseases diagnosed for a particular appointment
router.get("/disease", (req, res) => {
	const { appt_id } = req.body;
	const sql 	  = `SELECT name FROM diagnosis WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

/****************************************************/
/*                     Symptoms                     */
/****************************************************/
// Get symptoms shared for a particular appointment
router.get("/symptom", (req, res) => {
	const { appt_id } = req.body;
	const sql     = `SELECT name, description FROM has_symptoms WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

/****************************************************/
/*                       Tests                      */
/****************************************************/
// Assign test to technician
router.post("/test", (req, res) => {
	const { t_id, appt_id } = req.body;

	// get all technicians with the same qualification
	const selectTechnicialSql = `SELECT lt_id
								 FROM lab_technician
								 WHERE expertise = ( SELECT expertise_required
													 FROM tests
													 WHERE t_id = '${t_id}')`;
	const componentNamesSql = `select c_name 
							   FROM components
							   WHERE t_id = '${t_id}'`;

	connection.query(selectTechnicialSql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			// Get a random one 
			const lt_id = results[(Math.random() * results.length) % results.length].lt_id;
			const assignTestSql = `INSERT INTO assigned_test(lt_id, appt_id, t_id) VALUES (?)`;
			const assignTestTuple = [lt_id, appt_id, t_id];
			const initCompResultsSql = `INSERT INTO component_result(c_id, c_name, t_id, appt_id, score) VALUES (?)`;
			
			connection.query(componentNamesSql, (err, results) => { //? I HATE CALLBACKS :'(
				if (err) {
					res.status(500).send(err);
				} else {
					connection.beginTransaction((err) => {
						if (err) {
							res.status(500).send(err);
						}
						
						// Assign lab technician
						connection.query(assignTestSql, assignTestTuple, (err, results) => {
							if (err) {
								connection.rollback();
								res.status(500).send(err);
							} else {
								// Initialize all components
								results.map((component, i) => {
									let initCompResultsTuple = [uuidv4(), component.c_name, t_id, appt_id, null];
									connection.query(initCompResultsSql, initCompResultsTuple, (err, results) => {
										if (err) {
											connection.rollback();
											res.status(500).send(err);
										} else {
											if (i == results.length - 1)
												res.status(200).send({ results }); //! This probably won't always work correctly :D
										}
									});
								});
							}
						});
					});
				}
			});
		}
	});
});

module.exports = router