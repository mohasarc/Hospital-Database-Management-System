const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../../index');

// Read all the tests
router.get("/test", (req, res) => {
	const sql = `SELECT * FROM test`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
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
	const {name, expertise_required} = req.body;
	const t_id = uuidv4();
	const tuple = [t_id, name, expertise_required];

	// Prepare sql
	const sql = `INSERT INTO test(t_id, name, expertise_required) VALUES (?)`;

	// Perform sql
	connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// remove test
router.delete("/test", async (req, res) => {
	// Prepare values
	const {t_id} = req.body;

	// Prepare sql
	const sql = `DELETE FROM test
				 WHERE t_id = '${t_id}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// add a test component //TODO

// remove a test component //TODO

module.exports = router