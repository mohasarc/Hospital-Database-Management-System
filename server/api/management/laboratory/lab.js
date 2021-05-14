const express = require('express');
const router = express.Router();
const { connection } = require('../../../index');

// Read all labs
router.get("/lab", (req, res) => {
	const sql     = `SELECT * FROM lab`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Add a lab
router.post("/lab", (req, res) => {
	const { room_no } = req.body;
    const lab_id = uuidv4();
	const tuple = [lab_id, room_no];
	const sql     = `INSERT INTO lab(lab_id, room_no) VALUES(?)`;

	connection.query(sql, [tuple], (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Remove a lab
router.delete("/lab", async (req, res) => {
	const { lab_id } = req.body;

	const sql = `DELETE FROM lab
				 WHERE lab_id = '${lab_id}'`;

	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

module.exports = router