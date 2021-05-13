const express = require('express');
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../index');
const { APPT_STATUS } = require("../../constants");

/****************************************************/
/*                    Appointment                   */
/****************************************************/
// Create an appointment
router.post("/", (req, res) => {
    // Collect tuple data
	const { p_id, d_id, description } = req.body;
    const appt_id    = uuidv4();
    const date       = moment(new Date()).format( "YYYY-MM-DD" );
    const status     = APPT_STATUS.ONGOING;
    const appt_tuple = [appt_id, d_id, p_id, date, status, description];
    
    // Prepare SQL
	const appt_sql = `INSERT INTO appointment(appt_id, d_id, p_id, date, status, description) VALUES(?)`;

    // Perform SQL
	connection.query(appt_sql, appt_tuple, (err, results) => {
		if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send(results);
        }
	});
});

// Get all Appointments for a patient
router.get("/", (req, res) => {
	const { p_id } = req.body;
	const sql = `SELECT * FROM appointment WHERE p_id='${p_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send(results);
        }
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