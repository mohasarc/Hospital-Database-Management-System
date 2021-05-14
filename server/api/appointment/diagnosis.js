const express = require("express");
const router = express.Router();
const { connection } = require("../../index");

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

module.exports = router;