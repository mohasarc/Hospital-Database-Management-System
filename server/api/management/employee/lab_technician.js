const express = require("express");
const router = express.Router();
const { connection } = require("../../../index");

// get all lab_technicians
router.get("/lt", (req, res) => {
	const sql = `SELECT * FROM lab_technician`;
	performQuery(sql, res);
});

// add new lab_technician
router.post("/lt", (req, res) => {
	const { lt_id, expertise } = req.body;
	const values = [lt_id, expertise];
	const sql = `INSERT INTO lab_technician(lt_id, expertise) VALUES(?)`;
	performQuery(sql, res, values);
});

// remove a lab technician
router.delete("/lt", (req, res) => {
	const { lt_id } = req.body;
	const sql = `DELETE FROM lab_technician WHERE lt_id='${lt_id}'`;
	performQuery(sql, res);
});

// Change expertise
router.patch("/lt/expertise", (req, res) => {
	const { lt_id, expertise } = req.body;
	const sql = `UPDATE lab_technician SET expertise='${expertise}' WHERE lt_id='${lt_id}'`;
	performQuery(sql, res);
});

// Change lab working at
router.patch("/lt/works_at", (req, res) => {
	const { lt_id, lab_id } = req.body;
	const sql = `UPDATE works_at_lab SET lab_id='${lab_id}' WHERE lt_id='${lt_id}'`;
	performQuery(sql, res);
});

// Queries the given statement(stmt) and sends
// response using response(res) object
const performQuery = (stmt, res, values = []) => {
	connection.query(stmt, [values], (err, result) => {
		if (err) res.status(500).send(result);
		res.status(200).send(result);
	});
};

module.exports = router;
