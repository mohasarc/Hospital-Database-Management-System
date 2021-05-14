const express = require("express");
const router = express.Router();
const { connection } = require("../../index");

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

// Get all tests for an appointment
router.get("/test", (req, res) => {
	const { appt_id } = req.body;
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
router.get("/test/comps", (req, res) => {
	const { t_id, appt_id } = req.body;
	const sql = `SELECT *
				FROM component_result AS CR NATURAL JOIN components
				WHERE CR.appt_id='${appt_id}' and CR.t_id='${t_id}'`;
	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Add result of a test component
router.post("/test/comps", (req, res) => {
	const { t_id, c_id, appt_id, score } = req.body;
	const values = [c_id, t_id, appt_id, score];
	const sql = `INSERT INTO component_result(c_id, t_id, appt_id, score) VALUES(?);`;

	connection.query(sql, [values], (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all past results for a component //! confusing //TODO place this in the correct location person or here????????
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

module.exports = router;