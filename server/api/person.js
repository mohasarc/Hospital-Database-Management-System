const express = require('express');
const router = express.Router();
const { connection } = require('../index');

// Get all people who are not employees or patients
router.get("/not_identified", (req, res) => {
	const sql = `SELECT * FROM person WHERE person_id NOT IN (
		(SELECT pid FROM patient AS person_id) UNION     
		(SELECT lt_id person_id FROM lab_technician AS person_id) UNION     
		(SELECT ph_id FROM pharmacist AS person_id) UNION     
		(SELECT man_id FROM manager AS person_id)
	)`;
	performQuery(sql, res);	
});

// change first name // TODO

// change middle name // TODO

// change last name // TODO

// change dob // TODO

// change appt number // TODO

// change street name // TODO

// change street number // TODO

// change city // TODO

// change state // TODO

// change zip // TODO

// change country // TODO

// change country code // TODO

// change number // TODO

// change gender // TODO

// change email // TODO

// change password // TODO


// Delete account //TODO MAYBE???

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