const express = require("express");
const router = express.Router();
const { connection } = require("../index");

// Get all tests performed by the lab technician with given id
router.get("/lt/tests/:lt_id", (req, res) => {
	const { lt_id } = req.params;
	const sql = `SELECT *
				FROM assigned_test NATURAL JOIN test
				WHERE lt_id='${lt_id}'`;
	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Get all tests performed at a particular lab (using technician expertise + which lab they work at) //TODO
// GET "/tests"


module.exports = router;