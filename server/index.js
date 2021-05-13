const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv")
const { v4: uuidv4 } = require("uuid");
const { COMP_SCORE, TEST_STATUS } = require("./constants");
const app = express();
const PORT = 8000;
app.use(bodyParser.json());
dotenv.config();

// Connect to the DB
const connection = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: "hospitaldb",
});
// Export DB connection
module.exports.connection = connection;
connection.connect((err) => {
	if (err) throw err;
	connection.query("USE hospitaldb;", (err, result) => {
		if (err) throw err;
	});
});

// Redirect requests
const authentication = require('./api/authentication/authentication');
const appointment = require('./api/appointment/appointment');
app.use('/auth', authentication);
app.use('/appointment', appointment);

// Get all tests of the given patiant id
app.get("/tests/:pid", (req, res, _) => {
	const pid = req.params.pid;
	const sql = `SELECT test.t_id, test.name, dv.date, test.status
				FROM test, doc_visit AS dv
				WHERE test.appt_id = dv.appt_id AND dv.p_id='${pid}'
				ORDER BY dv.date DESC`;
	connection.query(sql, (err, results) => {
		if (err) throw err;
		res.status(200).send(results);
	});
});

// Get all components of the given test id
app.get("/tests/comps/:t_id", (req, res, _) => {
	const testID = req.params.t_id;
	const sql = `SELECT T.name, C.c_name, C.score
				FROM test AS T, components AS C
				WHERE T.t_id = C.t_id AND T.t_id='${testID}'`;
	connection.query(sql, (err, results) => {
		if (err) throw err;
		res.status(200).send(results);
	});
});

// Get all tests performed by the lab technician with given id
app.get("/tests/lt/:lt_id", (req, res) => {
	const lt_id = req.params.lt_id;
	const sql = `SELECT test.t_id, test.name, assigned_test.status
				FROM assigned_test NATURAL JOIN test
				where lt_id='${lt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Update the score of a test component
app.post("/tests/comps", (req, res) => {   //! NEEDS TO BE UPDATED ( I, mohammed, couldn't understand it ) @Elham
	const { t_id, c_name, score } = req.body;

	const sql1 = `UPDATE components
				SET score='${score}'
				WHERE c_name='${c_name}' and t_id='${t_id}'`;

	const sql2 = `UPDATE test
				SET status='${TEST_STATUS.finalized}'
				WHERE t_id='${t_id}' and NOT EXISTS (
					SELECT * FROM components WHERE t_id='${t_id}' and score='${COMP_SCORE.preparing}')`;

	connection.beginTransaction((err) => {
		if (err) {
			res.status(500).send("SOMETHING WENT WRONG!");
		}
		connection.query(sql1, (err, results) => {
			if (err) connection.rollback();
		});

		connection.query(sql2, (err, results) => {
			if (err) connection.rollback();
			res.status(200).send({ results });
		});
	});
});

// Read all possible symbtons
app.get("/symptoms", (req, res) => {
	const sql     = `SELECT * FROM symptoms`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Read the available tests
app.get("/tests", (req, res) => {
	const sql     = `SELECT * FROM tests`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// add test
app.post("/test", async (req, res) => {
	// Prepare values
	const {name, expertise_required} = req.body;
	const t_id = uuidv4();
	const tuple = [t_id, name, expertise_required];

	// Prepare sql
	const sql = `INSERT INTO test(t_id, name, expertise_required) VALUES (?)`;

	// Perform sql
	connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// remove test
app.delete("/test", async (req, res) => {
	// Prepare values
	const {t_id} = req.body;

	// Prepare sql
	const sql = `DELETE FROM test
				 WHERE t_id = '${t_id}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Read the set of all diseases
app.get("/diseases", (req, res) => {
	const sql     = `SELECT * FROM diseases`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Add disease
app.post("/disease", async (req, res) => {
	// Prepare values
	const { name } = req.body;
	const tuple = [name];

	// Prepare sql
	const sql = `INSERT INTO diseases(name) VALUES (?)`;

	// Perform sql
	connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// Remove disease
app.delete("/disease", async (req, res) => {
	// Prepare values
	const { name } = req.body;

	// Prepare sql
	const sql = `DELETE FROM diseases
				 WHERE name = '${name}'`;

	// Perform sql
	connection.query(sql, async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
