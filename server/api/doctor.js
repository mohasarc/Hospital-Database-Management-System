const express = require('express');
const router = express.Router();
const { connection } = require('../index');

// See all appointments for some time period
router.get("/appointment", (req, res) => {
    const { d_id, start_date, end_date } = req.body;
	const sql = `SELECT * 
                 FROM appointment
                 WHERE d_id = '${d_id}' AND date >='${start_date}' AND date <= '${end_date}'`;
                 
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});
    
// Make some days unavailable for appointment
router.post("/unavailable_date", (req, res) => {
    const { d_id, date } = req.body;
	const sql = `INSERT INTO doc_schedule (d_id, unavail_date) VALUES (?)`;
    const tuple = [d_id, date];

    connection.query(sql, tuple, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// Get all dates doctor is unavailable at
router.get("/unavailable_date", (req, res) => {
    const { d_id } = req.body;
	const sql = `SELECT unavail_date 
                 FROM doc_schedule
                 WHERE d_id = ${d_id}`;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

module.exports = router