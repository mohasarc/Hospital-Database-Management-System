const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../../index');

// Read all pharmacies
router.get("/pharmacy", (req, res) => {
	const sql     = `SELECT * FROM pharmacy`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Add a pharmacy
router.post("/pharmacy", (req, res) => {
	const { name, room_no } = req.body;
    const phmcy_id = uuidv4();
	const tuple = [phmcy_id, name, room_no];
	const sql     = `INSERT INTO pharmacy(phmcy_id, name, room_no) VALUES(?)`;

	connection.query(sql, [tuple], (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Remove a pharmacy
router.delete("/pharmacy", async (req, res) => {
	// Prepare values
	const { phmcy_id } = req.body;

	// Prepare sql
	const sql = `DELETE FROM pharmacy
				 WHERE phmcy_id = '${phmcy_id}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Update a pharmacy name
router.put("/pharmacy/name", async (req, res) => {
	// Prepare values
	const { phmcy_id, name } = req.body;

	// Prepare sql
	const sql = `UPDATE pharmacy
                 SET name = '${name}'
				 WHERE phmcy_id = '${phmcy_id}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Update a pharmacy room number
router.put("/pharmacy/room_no", async (req, res) => {
	// Prepare values
	const { phmcy_id, room_no } = req.body;

	// Prepare sql
	const sql = `UPDATE pharmacy
                 SET room_no = '${room_no}'
				 WHERE phmcy_id = '${phmcy_id}'`;

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