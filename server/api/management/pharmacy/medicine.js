const express = require('express');
const router = express.Router();
const { connection } = require('../../../index');

// Read all medicine
router.get("/medicine", (req, res) => {
	const sql = `SELECT * FROM medicine`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Read all medicines tha are not added for a particular appointment
router.get("/medicine/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql     = `SELECT * 
					 FROM medicine as M
					 WHERE M.name NOT IN (
						 SELECT name
						 FROM prescription
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

// Add a medicine
router.post("/medicine", (req, res) => {
	const { name } = req.body;
	const tuple = [name];
	const sql = `INSERT INTO medicine(name) VALUES(?)`;

	connection.query(sql, [tuple], (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Remove a medicine
router.delete("/medicine", async (req, res) => {
	// Prepare values
	const { name } = req.body;

	console.log('name', name);

	// Prepare sql
	const sql = `DELETE FROM medicine
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