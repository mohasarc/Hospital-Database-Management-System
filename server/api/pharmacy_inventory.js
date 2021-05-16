const express = require("express");
const router = express.Router();
const { connection } = require("../index");

// get all medicines of a pharmacy
router.get("/inventory/:phmcy_id", (req, res) => {
	const { phmcy_id } = req.params;
	const sql = `SELECT * FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}'`;

	performQuery(sql, res);
});

// Add a medicine
router.post("/inventory/medicine", (req, res) => {
	const { name, phmcy_id, expiry_date, inventory_count } = req.body;
	const values = [name, phmcy_id, expiry_date, inventory_count];
	const sql = `INSERT INTO phmcy_stores_med(name, phmcy_id, expiry_date, inventory_count) VALUES(?)`;
	// res.status(500).send(" eror roofadfila dfj");
	performQuery(sql, res, values);
});

// remove medicine from inventory
// remove a medicine of a particular date if date was specified
router.delete("/inventory/medicine", (req, res) => {
	const { name, phmcy_id, expiry_date } = req.body;
	console.log('body ===> ', req.body);
	let sql;
	if (expiry_date) {
		sql = `DELETE FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}' AND name='${name}' AND expiry_date='${expiry_date}'`;
	} else {
		sql = `DELETE FROM phmcy_stores_med WHERE phmcy_id='${phmcy_id}' AND name='${name}'`;
	}

	performQuery(sql, res);
});

// update inventory count
router.put("/inventory/medicine", (req, res) => {
	const { name, phmcy_id, expiry_date, inventory_count } = req.body;
	const sql = `UPDATE phmcy_stores_med
				 SET inventory_count = '${inventory_count}'
				 WHERE phmcy_id='${phmcy_id}' AND name='${name}' AND expiry_date='${expiry_date}'`;

	performQuery(sql, res);
});

// get number of medicines available in pharmacy 
// (for a particular expiry date if specified)
router.get("/inventory/medicine/:phmcy_id/:name/:expiry_date", (req, res) => {
	const { phmcy_id, name, expiry_date } = req.params;
	let sql;
	if (expiry_date) {
		sql = `SELECT inventory_count 
			   FROM phmcy_stores_med 
			   WHERE phmcy_id='${phmcy_id}' AND name='${name}' AND expiry_date = '${expiry_date}'`;
	} else {
		sql = `SELECT inventory_count 
			   FROM phmcy_stores_med 
			   WHERE phmcy_id='${phmcy_id}' AND name='${name}'`;
	}

	performQuery(sql, res);
});

/**
 * Queries the given statement(stmt) and sends
 * response using response(res) object
 * @param {*} stmt 
 * @param {*} res 
 * @param {*} values 
 */
const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		console.log(err);
		if (err) res.status(500).send(result);
		res.status(200).send(result);
	});
};

module.exports = router;
