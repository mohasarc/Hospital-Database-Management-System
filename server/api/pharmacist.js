const express = require('express');
const router = express.Router();
const { connection } = require('../index');

// Get all people who are not employees or patients
router.get("/:ph_id", (req, res) => {
    const ph_id = req.params.ph_id;
    const sql = `SELECT * FROM works_at_phmcy NATURAL JOIN pharmacy WHERE ph_id='${ph_id}'`;
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

module.exports = router