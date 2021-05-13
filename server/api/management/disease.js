const express = require('express');
const router = express.Router();
const { connection } = require('../../index');

// Read all diseases
router.get("/disease", (req, res) => {
	const sql     = `SELECT * FROM diseases`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Add a disease
router.post("/disease", async (req, res) => {
	// Prepare values
	const { name } = req.body;
	const tuple = [name];

	// Prepare sql
	const sql = `INSERT INTO diseases(name) VALUES (?)`;

	// Perform sql
	connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Remove a disease
router.delete("/disease", async (req, res) => {
	// Prepare values
	const { name } = req.body;

	// Prepare sql
	const sql = `DELETE FROM diseases
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