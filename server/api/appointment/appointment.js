const express = require("express");
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../../index");
const { APPT_STATUS } = require("../../constants");

// Create an appointment
router.post("/", (req, res) => {
	const { p_id, d_id, description, date } = req.body;
	const appt_id = uuidv4();
	// const date = moment(new Date()).format("YYYY-MM-DD");
	const status = APPT_STATUS.ONGOING;

	// In case appointment cancelled and patients wants to make again
	let sql = `SELECT * FROM appointment WHERE d_id='${d_id}' and date='${date}'`;
	connection.query(sql, (err, result) => {
		if (err) res.status(500).send(err);
		if (result.length !== 0 && result[0].status === APPT_STATUS.CANCELLED) {
			sql = `UPDATE appointment SET status='${APPT_STATUS.ONGOING}', p_id='${p_id}', description='${description}' WHERE appt_id='${result[0].appt_id}'`;
			performQuery(sql, res);
		} else {
			// In case patient wants to make new appointment
			const appt_tuple = [appt_id, d_id, p_id, date, status, description];
			const appt_sql = `INSERT INTO appointment(appt_id, d_id, p_id, date, status, description) VALUES(?)`;
			performQuery(appt_sql, res, appt_tuple);
		}
	});
});

// Get all Appointments for a patient
router.get("/:p_id", (req, res) => {
	const { p_id } = req.params;
	const sql = `SELECT * FROM appointment INNER JOIN person ON (d_id=person_id) WHERE p_id='${p_id}' AND status!='CANCELLED'`;
	performQuery(sql, res);
});

// Cancel an appointment for a patient
router.patch("/", (req, res) => {
	const { appt_id } = req.body;
	const sql = `UPDATE appointment SET status='${APPT_STATUS.CANCELLED}' WHERE appt_id='${appt_id}'`;
	performQuery(sql, res);
})

// End an appointment
router.patch("/end", (req, res) => {
	const { appt_id } = req.body;
	const sql = `UPDATE appointment SET status='${APPT_STATUS.COMPLETE}' WHERE appt_id='${appt_id}'`;
	performQuery(sql, res);
})

// get appointment details //TODO

const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		if (err) res.status(500).send(err);
		res.status(200).send(result);
	});
};

module.exports = router;
