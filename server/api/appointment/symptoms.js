const express = require("express");
const router = express.Router();
const { connection } = require("../../index");

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
router.get("/symptom/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql = `SELECT name, description FROM has_symptoms WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

module.exports = router;