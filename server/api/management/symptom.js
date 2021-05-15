const express = require('express');
const router = express.Router();
const { connection } = require('../../index');

// Read all possible symptoms
router.get("/symptom", (req, res) => {
	const sql     = `SELECT * FROM symptoms`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Read all symptoms not selected for particular appointment
router.get("/symptom/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql     = `SELECT * 
					 FROM symptoms as S
					 WHERE S.name NOT IN (
						 SELECT name
						 FROM has_symptoms
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

// Add a symptom
router.post("/symptom", (req, res) => {
	const { name } = req.body;
	const tuple = [name];
	const sql     = `INSERT INTO symptoms(name) VALUES(?)`;

	connection.query(sql, [tuple], (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Remove a symptom
router.delete("/symptom", async (req, res) => {
	// Prepare values
	const { name } = req.body;

	// Prepare sql
	const sql = `DELETE FROM symptoms
				 WHERE name = '${name}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

module.exports = router