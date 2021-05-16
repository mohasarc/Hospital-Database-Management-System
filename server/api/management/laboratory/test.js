const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../../index');

// Read all the tests
router.get("/test", (req, res) => {
	const sql = `SELECT * FROM test`;
	performQuery(sql, res);
});

// Read all tests tha are not asked for a particular appointment
router.get("/test/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql     = `SELECT * 
					 FROM test as T
					 WHERE T.t_id NOT IN (
						 SELECT t_id
						 FROM assigned_test
						 WHERE appt_id='${appt_id}'
					 )`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// add test
router.post("/test", async (req, res) => {
	// Prepare values
	const { name, expertise_required } = req.body;
	const t_id = uuidv4();
	const tuple = [t_id, name, expertise_required];

	// Prepare sql
	const sql = `INSERT INTO test(t_id, name, expertise_required) VALUES (?)`;

	// Perform sql
	performQuery(sql, res, tuple);
});

// remove test
router.delete("/test", async (req, res) => {
	// Prepare values
	const { t_id } = req.body;

	// Prepare sql
	const sql = `DELETE FROM test
				 WHERE t_id = '${t_id}'`;

	// Perform sql
	performQuery(sql, res);
});

// add a test component
router.post("/test/comps", (req, res) => {
	const { c_id, c_name, t_id, min_interval, max_interval } = req.body;
	const values = [c_id, c_name, t_id, min_interval, max_interval];
	const sql = `INSERT INTO components(c_id, c_name, t_id, min_interval, max_interval) VALUES(?)`;
	performQuery(sql, res, values);
});

// Get components of a test
router.get("/test/comps/:t_id", async (req, res) => {
	const t_id = req.params.t_id;
	const sql = `SELECT * FROM components WHERE t_id=${t_id}`;
	performQuery(sql, res);
});


// remove a test component
router.delete("/test/comps", (req, res) => {
	const { c_id, t_id } = req.body;
	const values = [c_id, c_name, t_id, min_interval, max_interval];
	const sql = `DELETE FROM components WHERE c_id='${c_id}' AND t_id='${t_id}'`;
	performQuery(sql, res);
});

const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		if (err) res.status(500).send(err);
		res.status(200).send(result);
	});
};

module.exports = router