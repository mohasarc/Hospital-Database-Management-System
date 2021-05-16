const express = require('express');
const router = express.Router();
const { connection } = require('../../../index');

// Read all departments
router.get("/department", (req, res) => {
	const sql     = `SELECT * FROM department`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

router.get("/departmentWithDoctors", (req, res) => {
	const sql = `SELECT * FROM department WHERE name IN (
		SELECT dept_name FROM doctor
	)`;
	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
})

// Add a department
router.post("/department", (req, res) => {
	const { name } = req.body;
	const tuple = [name];
	const sql     = `INSERT INTO department(name) VALUES(?)`;

	connection.query(sql, [tuple], (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Remove a department
router.delete("/department", async (req, res) => {
	const { name } = req.body;

	const sql = `DELETE FROM department
				 WHERE name = '${name}'`;

	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

module.exports = router