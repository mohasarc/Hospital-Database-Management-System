const express = require("express");
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../../index");
const { APPT_STATUS } = require("../../constants");

/****************************************************/
/*                    Appointment                   */
/****************************************************/
// Create an appointment
router.post("/", (req, res) => {
	//! Probably we need to limit the number of appointments the patient can have to 1 per day?
	// Collect tuple data
	const { p_id, d_id, description } = req.body;
	const appt_id = uuidv4();
	const date = moment(new Date()).format("YYYY-MM-DD");
	const status = APPT_STATUS.ONGOING;
	const appt_tuple = [appt_id, d_id, p_id, date, status, description];

	// Prepare SQL
	const appt_sql = `INSERT INTO appointment(appt_id, d_id, p_id, date, status, description) VALUES(?)`;

	// Perform SQL
	connection.query(appt_sql, [appt_tuple], (err, results) => {
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
router.post("/diagnosis", async (req, res) => {
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
		var canDiagnose = true;

		if (err) {
			res.status(500).send(err);
		} else {
			// Check if all tests were finalized
			for (let i = 0; i < result.length; i++) {
				if (result[i].status != TEST_STATUS.finalized) {
					res.status(500).send(
						"There are some tests that are not yet finalized!"
					);
					canDiagnose = false;
					break;
				}
			}

			// finalize diagnozing disease
			if (canDiagnose) {
				connection.query(sql, [tuple], async (err, result) => {
					if (err) {
						res.status(500).send(err);
					} else {
						res.status(200).send(result);
					}
				});
			}
		}
	});
});

// Get the diseases diagnosed for a particular appointment
router.get("/diagnosis", (req, res) => {
	const { appt_id } = req.body;
	const sql = `SELECT name FROM diagnosis WHERE appt_id='${appt_id}'`;

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
// Add a symbtom
router.post("/symptom", (req, res) => {
	const { appt_id, name, description } = req.body;
	const patient_symptoms_tuple = [appt_id, name, description];
	const patient_symptoms_sql = `INSERT INTO has_symptoms(appt_id, name, description) VALUES(?)`;

	connection.query(
		patient_symptoms_sql,
		[patient_symptoms_tuple],
		(err, results) => {
			if (err) {
				res.status(200).send(err);
			} else {
				res.status(200).send(results);
			}
		}
	);
});

// Get symptoms shared for a particular appointment
router.get("/symptom", (req, res) => {
	const { appt_id } = req.body;
	const sql = `SELECT name, description FROM has_symptoms WHERE appt_id='${appt_id}'`;

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
	//! TO BE TESTED !!!!
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
			const lt_id =
				results[(Math.random() * results.length) % results.length]
					.lt_id;
			const assignTestSql = `INSERT INTO assigned_test(lt_id, appt_id, t_id) VALUES (?)`;
			const assignTestTuple = [lt_id, appt_id, t_id];
			const initCompResultsSql = `INSERT INTO component_result(c_id, c_name, t_id, appt_id, score) VALUES (?)`;

			connection.query(componentNamesSql, (err, results) => {
				//? I HATE CALLBACKS :'(
				if (err) {
					res.status(500).send(err);
				} else {
					connection.beginTransaction((err) => {
						if (err) {
							res.status(500).send(err);
						}

						// Assign lab technician
						connection.query(
							assignTestSql,
							assignTestTuple,
							(err, results) => {
								if (err) {
									connection.rollback();
									res.status(500).send(err);
								} else {
									// Initialize all components
									results.map((component, i) => {
										let initCompResultsTuple = [
											uuidv4(),
											component.c_name,
											t_id,
											appt_id,
											null,
										];
										connection.query(
											initCompResultsSql,
											initCompResultsTuple,
											(err, results) => {
												if (err) {
													connection.rollback();
													res.status(500).send(err);
												} else {
													if (i == results.length - 1)
														res.status(200).send({
															results,
														}); //! This probably won't always work correctly :D
												}
											}
										);
									});
								}
							}
						);
					});
				}
			});
		}
	});
});

// Get all tests for a patient
router.get("/tests/patient", (req, res) => {
	const p_id = req.body.p_id;
	const sql = `SELECT at.t_id, apt.p_id, at.appt_id, apt.date, at.status
				FROM assigned_test AS at, appointment AS apt
				WHERE apt.appt_id=at.appt_id AND apt.p_id='${p_id}'
				ORDER BY apt.date DESC`;
	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all testS for an appointment
router.get("/tests/appt", (req, res) => {
	const appt_id = req.body.appt_id;
	const sql = `SELECT  apt.appt_id, apt.p_id, at.t_id, apt.date, at.status
				FROM assigned_test AS at, appointment AS apt
				WHERE apt.appt_id=at.appt_id and apt.appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all components for a test
// with test id as t_id and appointment id as appt_id
router.get("/tests/comps", (req, res, _) => {
	const t_id = req.body.t_id;
	const appt_id = req.body.appt_id;
	const sql = `SELECT *
				FROM component_result AS CR NATURAL JOIN components
				WHERE CR.appt_id='${appt_id}' and CR.t_id='${t_id}'`;
	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all past results for a component
// using patient id, test id, comp. id, and
// the current appiontment id that user has
// selected component from
router.get("/tests/patient/comps", (req, res) => {
	const { p_id, t_id, c_id, appt_id } = req.body;
	const sql = `SELECT CR.c_id, CR.t_id, AP.appt_id, CR.score, AP.date
				FROM component_result AS CR, appointment AS AP
				WHERE CR.appt_id=AP.appt_id AND AP.p_id='${p_id}' AND CR.t_id='${t_id}' AND CR.c_id='${c_id}' and CR.appt_id <> '${appt_id}'
				ORDER BY AP.date DESC;`;

	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Add result of a test component
router.post("/tests/comps", (req, res) => {
	const { t_id, c_id, appt_id, score } = req.body;
	const values = [c_id, t_id, appt_id, score];
	const sql = `INSERT INTO component_result(c_id, t_id, appt_id, score) VALUES(?);`;

	connection.query(sql, [values], (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all tests performed by the lab technician with given id
router.get("/tests/lt", (req, res) => {
	const lt_id = req.body.lt_id;
	const sql = `SELECT *
				FROM assigned_test NATURAL JOIN test
				WHERE lt_id='${lt_id}'`;
	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

module.exports = router;
