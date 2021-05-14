const express = require("express");
const router = express.Router();
const { connection } = require("../../../index");

// get all medicines of a pharmacy
router.get("/pharmacy", (req, res) => {
	const { phmcy_id } = req.body;
	const sql = `SELECT * FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}'`;
	performQuery(sql, res);
});

router.post("/pharmacy", (req, res) => {
	const { name, phmcy_id, expiry_date } = req.body;
	const values = [name, phmcy_id, expiry_date];
	const sql = `INSERT INTO phmcy_stores_med(name, phmcy_id, expiry_date) VALUES(?)`;
	performQuery(sql, res, values);
});

// remove medicine from inventory
router.delete("/pharmacy", (req, res) => {
	const { name, phmcy_id } = req.body;
	const sql = `DELETE FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}' AND name='${name}'`;
	performQuery(sql, res);
});

// update inventory count ||

// get number of medicines available in pharmacy
router.get("/pharmacy/count", (req, res) => {
	const { phmcy_id } = req.body;
	const sql = `SELECT COUNT(*) AS count FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}'`;
	performQuery(sql, res);
});

// Queries the given statement(stmt) and sends
// response using response(res) object
const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		console.log(result);
		if (err) res.status(500).send(result);
		res.status(200).send(result);
	});
};

module.exports = router;
