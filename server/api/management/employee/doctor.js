const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../../../index");
const { APPT_STATUS } = require("../../../constants");

// get all doctors (or ones available for particular date & department)
router.get("/doctor/:date/:dept_name", (req, res) => {
	const { date, dept_name } = req.params;
	const sql  = `SELECT * 
			FROM person INNER JOIN doctor ON (person_id=d_id)
			WHERE doctor.dept_name = "${dept_name}"
			AND doctor.d_id NOT IN (
				(
					SELECT d_id 
					FROM doc_schedule
					WHERE doc_schedule.unavail_date = "${date}"
				) 
				UNION
				(
					SELECT d_id
					FROM appointment
					WHERE appointment.status != "${APPT_STATUS.COMPLETE}" AND appointment.date = "${date}"
				)
			)`;

	performQuery(sql, res);
});

router.get("/doctor", (req, res) => {
	const sql = `SELECT * FROM person INNER JOIN doctor ON (person_id=d_id);`;

	performQuery(sql, res);
});

// add a new doctor
router.post("/doctor", (req, res) => {
	const { d_id, dept_name, specialization, qualification } = req.body;
	const values = [d_id, dept_name, specialization, qualification];
	const sql = `INSERT INTO doctor(d_id, dept_name, specialization, qualification) VALUES(?)`;
	performQuery(sql, res, values);
});

router.delete("/doctor", (req, res) => {
	const { d_id } = req.body;
	const sql = `DELETE FROM doctor WHERE d_id='${d_id}'`;
	performQuery(sql, res);
});

// change specialization
router.patch("/doctor/spec", (req, res) => {
	const { d_id, specialization } = req.body;
	const sql = `UPDATE doctor SET specialization='${specialization}' WHERE d_id='${d_id}'`;
	performQuery(sql, res);
});
// change qualification
router.patch("/doctor/qual", (req, res) => {
	const { d_id, qualification } = req.body;
	const sql = `UPDATE doctor SET qualification='${qualification}' WHERE d_id='${d_id}'`;
	performQuery(sql, res);
});
// change department
router.patch("/doctor/dept", (req, res) => {
	const { d_id, dept_name } = req.body;
	const sql = `UPDATE doctor SET dept_name='${dept_name}' WHERE d_id='${d_id}'`;
	performQuery(sql, res);
});

// Queries the given statement(stmt) and sends
// response using response(res) object
const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		// console.log(result);
		if (err) res.status(500).send(result);
		res.status(200).send(result);
	});
};

module.exports = router;
