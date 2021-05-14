const express = require("express");
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../../index");
const { APPT_STATUS } = require("../../constants");

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
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// get appointment details //TODO

module.exports = router;
