const express = require('express');
const router = express.Router();
const { connection } = require('../index');

// Read all patients
router.get("/", (req, res) => {
	const sql     = `SELECT * FROM patient`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Add a patient
router.post("/", (req, res) => {
    const { person_id, height, weight, blood_group } = req.body;
    const height_int = parseFloat(height);
    const weight_int = parseFloat(weight);
    const registration_date = moment(new Date()).format( "YYYY-MM-DD" );
    tuple = [ person_id, height_int, weight_int, blood_group, registration_date ];
    const sql = "INSERT INTO patient (pid, height, weight, blood_group, registration_date) VALUES (?)";
    
    connection.query(sql, [tuple], (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send("Patient Inserted successfully!");
        }
    });
});

// Remove a patient
router.delete("/", async (req, res) => {
	// Prepare values
	const { pid } = req.body;

	// Prepare sql
	const sql = `DELETE FROM patient
				 WHERE pid = '${pid}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Update a patient height
router.put("/height", async (req, res) => {
	// Prepare values
	const { pid, height } = req.body;
    const height_int = parseFloat(height);

	// Prepare sql
	const sql = `UPDATE patient
                 SET height = '${height_int}'
				 WHERE pid = '${pid}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Update a patient weight
router.put("/weight", async (req, res) => {
	// Prepare values
	const { pid, weight } = req.body;
    const weight_int = parseFloat(weight);

	// Prepare sql
	const sql = `UPDATE patient
                 SET weight = '${weight_int}'
				 WHERE pid = '${pid}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Update a patient blood group
router.put("/blood_group", async (req, res) => {
	// Prepare values
	const { pid, blood_group } = req.body;

	// Prepare sql
	const sql = `UPDATE patient
                 SET blood_group = '${blood_group}'
				 WHERE pid = '${pid}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Get all Appointments for a patient
router.get("/appointment/:p_id", (req, res) => {
	const { p_id } = req.params;
	const sql = `SELECT * FROM appointment WHERE p_id='${p_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Get all tests for a patient
router.get("/test/:p_id", (req, res) => {
	const { p_id } = req.params;
	const sql = `SELECT at.t_id, apt.p_id, at.appt_id, apt.date, at.status
				FROM assigned_test AS at, appointment AS apt
				WHERE apt.appt_id=at.appt_id AND apt.p_id='${p_id}'
				ORDER BY apt.date DESC`;

	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all previously diagnosed diseases // TODO
router.get("/disease/:p_id", (req, res) => {
	const { p_id } = req.params;
	const sql = `SELECT at.t_id, apt.p_id, at.appt_id, apt.date, at.status
				FROM assigned_test AS at, appointment AS apt
				WHERE apt.appt_id=at.appt_id AND apt.p_id='${p_id}'
				ORDER BY apt.date DESC`;

	connection.query(sql, (err, results) => {
		if (err) res.status(500).send(err);
		res.status(200).send(results);
	});
});

// Get all previous prescriptions // TODO

// Get all previous appointments // TODO (includes all information symptoms + tests + diagnosis + presecriptions)

module.exports = router