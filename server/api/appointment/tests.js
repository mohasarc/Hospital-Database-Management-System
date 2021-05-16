const express = require("express");
const { TEST_STATUS } = require("../../constants");
const router = express.Router();
const { connection } = require("../../index");
const { v4: uuidv4 } = require("uuid");

// Assign test to technician
router.post("/test", (req, res) => {
	const { t_id, appt_id } = req.body;

	// get all technicians with the same qualification
	const selectTechnicialSql = `SELECT lt_id
								 FROM lab_technician
								 WHERE expertise IN ( SELECT expertise_required
													 FROM test
													 WHERE t_id = '${t_id}')`;
	const componentNamesSql = `select c_name 
							   FROM components
							   WHERE t_id = '${t_id}'`;

	connection.query(selectTechnicialSql, (err, tech_results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			if (tech_results.length == 0) {
				res.status(500).send("NO LAB TECHNICIANS");
			} else {
				console.log("there is more than one lab tech")
				// Get a random one
				const lt_id = tech_results[(Math.random() * (tech_results.length - 1))].lt_id;
				const assignTestSql = `INSERT INTO assigned_test(lt_id, appt_id, t_id, status) VALUES (?)`;
				const assignTestTuple = [lt_id, appt_id, t_id, TEST_STATUS.assigned];
				var initCompResultsSql = `INSERT INTO component_result(c_id, c_name, t_id, appt_id, score) VALUES`;
	
				connection.query(componentNamesSql, (err, comp_results) => {
					//? I HATE CALLBACKS :'(
					if (err) {
						res.status(500).send(err);
					} else {
						connection.beginTransaction((err) => {
							if (err) {
								console.log("error0:", err);
	
								res.status(500).send(err);
							}
	
							// Assign lab technician
							connection.query(assignTestSql, [assignTestTuple], (err, in_results) => {
								if (err) {
									connection.rollback();
									console.log("error1:", err);
									res.status(500).send(err);
								} else {
									// Initialize all components
									if ( comp_results.length > 0 ){
										var initCompResultsTuple = [];
										comp_results.map((component, i) => {
											initCompResultsSql += '(?)'
											initCompResultsTuple.push([ uuidv4(), component.c_name, t_id, appt_id, null ]);
										});
	
										connection.query( initCompResultsSql, initCompResultsTuple, (err, init_results) => {
											if (err) {
												connection.rollback();
												console.log("error2:", err);
												res.status(500).send(err);
											} else {
												res.status(200).send({
													init_results,
												});
											}
										});
									}
								}
							});
						});
					}
				});
			}
		}
	});
});

// Get all tests for an appointment
router.get("/test/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql = `
				SELECT *
				FROM (
					SELECT  apt.appt_id, apt.p_id, at.t_id, apt.date, at.status
					FROM assigned_test AS at, appointment AS apt
					WHERE apt.appt_id=at.appt_id and apt.appt_id='${appt_id}'
				) AS T
				INNER JOIN test
				ON T.t_id = test.t_id
				`;

	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get result of all components of a test
// with test id as t_id and appointment id as appt_id
router.get("/test/comps/:appt_id/:t_id", (req, res) => {
	const { t_id, appt_id } = req.params;
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
	console.log("vale s===== >", values);
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
router.get("/tests/patient/comps/:appt_id/:p_id/:t_id/:c_id", (req, res) => {
	const { appt_id, p_id, t_id, c_id } = req.params;
	const sql = `SELECT CR.c_id, CR.t_id, AP.appt_id, CR.score, AP.date
				FROM component_result AS CR, appointment AS AP
				WHERE CR.appt_id=AP.appt_id AND AP.p_id='${p_id}' AND CR.t_id='${t_id}' AND CR.c_id='${c_id}' and CR.appt_id <> '${appt_id}'
				ORDER BY AP.date DESC;`;
	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

router.delete("/test/:appt_id/:t_id", (req, res) => {
	const { appt_id, t_id } = req.params;
	const sql1 = `DELETE FROM assigned_test
					WHERE appt_id='${appt_id}' AND t_id='${t_id}'`;
	const sql2 = `DELETE FROM component_result
					WHERE appt_id='${appt_id}' AND t_id='${t_id}'`;

	connection.query(sql1, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			connection.query(sql2, (err, results) => {
				if (err) res.status(500).send(err);
				res.status(200).send(results);
			});
		}
	});
});

module.exports = router;