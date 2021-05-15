const express = require("express");
const router = express.Router();
const { connection } = require("../index");

// // Get all tests performed by the lab technician with given id
// router.get("/lt/tests/:lt_id", (req, res) => {
// 	const { lt_id } = req.params;
// 	const sql = `SELECT *
// 				FROM assigned_test NATURAL JOIN test
// 				WHERE lt_id='${lt_id}'`;
// 	connection.query(sql, (err, results) => {
// 		if (err) {
// 			res.status(500).send(err);
// 		} else {
// 			res.status(200).send(results);
// 		}
// 	});
// });

// Get all tests performed by the lab technician with given id
router.get("/lt/tests/:lt_id", (req, res) => {
	const { lt_id } = req.params;
	const sql = `SELECT AT.t_id, T.name, AT.lt_id, At.appt_id, app.date, AT.status
				FROM assigned_test AS AT NATURAL JOIN test AS T, appointment AS app
				WHERE AT.lt_id='${lt_id}' AND app.appt_id=AT.appt_id;`;
	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Get components for a test of an appiontment 
// wiht status as preparing or finalized 
router.get("/lt/tests/:lt_id/:appt_id/:t_id", (req, res) => {
	const { lt_id, appt_id, t_id } = req.params;
	const sql = `select A.appt_id, A.t_id, C.c_id, C.c_name, C.min_interval, C.max_interval, A.score
				from components as C 
				left join (
						select AT.appt_id, AT.t_id, AT.status, CR.score , CR.c_id
						from assigned_test as AT,  component_result as CR
						where AT.lt_id='${lt_id}' and AT.appt_id=CR.appt_id and 
						AT.appt_id='${appt_id}' and AT.t_id=${t_id} and CR.t_id='${t_id}'
					) as A on C.t_id=A.t_id and C.c_id=A.c_id
				where C.t_id=${t_id}`;
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