const express = require("express");
const router = express.Router();
const { connection } = require("../../index");

// Add a prescription medicine
router.post("/prescription", (req, res) => {
	const { appt_id, name } = req.body;
	const tuple = [appt_id, name];
	const sql = `INSERT INTO prescription(appt_id, name) VALUES(?)`;

	connection.query(
		sql,
		[tuple],
		(err, results) => {
			if (err) {
                console.log("the error", err);
				res.status(500).send(err);
			} else {
				res.status(200).send(results);
			}
		}
	);
});

// Get prescriptions shared for a particular appointment
router.get("/prescription/:appt_id", (req, res) => {
	const { appt_id } = req.params;
	const sql = `SELECT * FROM prescription WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// remove prescriptions shared for a particular appointment
router.delete("/prescription/:appt_id/:name", (req, res) => {
	const { appt_id, name } = req.params;
	const sql = `DELETE FROM prescription WHERE appt_id='${appt_id}' AND name='${name}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

module.exports = router;