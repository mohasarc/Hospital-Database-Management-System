const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../../../index");
const { APPT_STATUS } = require("../../../constants");

// Get all dates that all doctors are busy for specific dept
router.get("/doctor/:start_date/:end_date/:dept_name", (req, res) => {
	const { start_date, end_date, dept_name } = req.params;
	const sql  = `
			(
				SELECT DISTINCT U.unavail_date as date
				FROM doc_schedule as U
				WHERE unavail_date >= "${start_date}" AND unavail_date <= "${end_date}" 
				AND NOT EXISTS (
						SELECT d_id
						FROM doctor
						WHERE dept_name = "${dept_name}" AND d_id NOT IN (
							(
							SELECT S.d_id
							FROM doc_schedule as S
							WHERE S.unavail_date = U.unavail_date
							)
							UNION
							(
							SELECT d_id
							FROM appointment
							WHERE status = "ONGOING" AND date = U.unavail_date
							)
						)
				)
			) 
			UNION
			(
				SELECT date
				FROM appointment as A
				WHERE A.status = "ONGOING" AND A.date >= "${start_date}" AND A.date <= "${end_date}" 
				AND NOT EXISTS (
						SELECT d_id
						FROM doctor
						WHERE dept_name = "${dept_name}" AND d_id NOT IN (
							(
								SELECT T.d_id
								FROM appointment as T
								WHERE T.date = A.date
							)
							UNION
							(
								SELECT d_id
								FROM doc_schedule
								WHERE unavail_date = A.date
							)
			
						)
				)
			)`;

	performQuery(sql, res);
});

// get all doctors  available for particular date & department
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
