const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql");
const moment = require("moment");
const dotenv = require("dotenv")
const { USER_TYPES, COMP_SCORE, TEST_STATUS } = require("./constants");
dotenv.config();
const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: "hospitaldb",
});

const PORT = 8000;

connection.connect((err) => {
	if (err) throw err;
	connection.query("USE hospitaldb;", (err, result) => {
		if (err) throw err;
	});
});

app.post("/signup", async (req, res) => {
	const {
		first_name,
		middle_name,
		last_name,
		dob,
		apt_num,
		street_name,
		street_num,
		city,
		state,
		zip,
		country,
		country_code,
		number,
		gender,
		e_mail,
		password,
		type,
	} = req.body;
	let sql =
		"INSERT INTO person (person_id, first_name, middle_name, last_name, dob, apt_num, street_name, street_num, city, state, zip, country, country_code, number, gender, e_mail, password) VALUES (?)";
	const person_id = uuidv4();
	let tuple = [
		person_id,
		first_name,
		middle_name,
		last_name,
		dob,
		apt_num,
		street_name,
		street_num,
		city,
		state,
		zip,
		country,
		country_code,
		number,
		gender,
		e_mail,
		password,
	];
	await connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			console.log(err);
			res.status(500).send();
		}
		switch (type.toUpperCase()) {
			case USER_TYPES.Doctor:
				{
					sql =
						"INSERT INTO doctor (d_id, dept_name, specialization, qualification) VALUES (?)";
					const { dept_name, specialization, qualification } =
						req.body;
					tuple = [
						person_id,
						dept_name,
						specialization,
						qualification,
					];
					await connection.query(sql, [tuple], (error, result) => {
						if (error) {
							sql = `DELETE FROM person WHERE person_id='${person_id}'`;
							console.log(error);
							connection.query(sql, (error, result) => {});
							res.status(500).send();
						}
					});
				}
				break;
			case USER_TYPES.Pharmacist:
				{
					sql =
						"INSERT INTO pharmacist (ph_id, qualifications) VALUES (?)";
					const { qualifications } = req.body;
					tuple = [person_id, qualifications];
					await connection.query(sql, [tuple], (error, result) => {
						if (error) {
							sql = `DELETE FROM person WHERE person_id='${person_id}'`;
							console.log(error);
							connection.query(sql, (error, result) => {});
							res.status(500).send();
						}
					});
				}
				break;
			case USER_TYPES.Lab_Technician:
				{
					const { expertise } = req.body;
					sql =
						"INSERT INTO lab_technician (lt_id, expertise) VALUES (?);";
					tuple = [person_id, expertise];
					await connection.query(sql, [tuple], (error, result) => {
						if (error) {
							sql = `DELETE FROM person WHERE person_id='${person_id}'`;
							console.log(error);
							connection.query(sql, (error, result) => {});
							res.status(500).send();
						}
					});
				}
				break;
			case USER_TYPES.Patient:
				{
					sql =
						"INSERT INTO patient (pid, height, weight, blood_group, registration_date) VALUES (?)";
					const { height, weight, blood_group } = req.body;
					const height_int = parseFloat(height);
					const weight_int = parseFloat(weight);
					let registration_date = moment(new Date()).format(
						"YYYY-MM-DD"
					);
					tuple = [
						person_id,
						height_int,
						weight_int,
						blood_group,
						registration_date,
					];
					await connection.query(sql, [tuple], (error, result) => {
						if (error) {
							sql = `DELETE FROM person WHERE person_id='${person_id}'`;
							connection.query(sql, (error, result) => {});
							console.log(error);
							res.status(500).send();
						}
					});
				}
				break;
			default:
				throw new Error("Unimplemented type");
				res.status(500).send();
		}
		res.status(200).send("Successfully Inserted");
		return;
	});
});

app.post("/login", async (req, res) => {
	const { e_mail, password, type } = req.body;
	let sql = `SELECT * FROM person WHERE e_mail='${e_mail}' AND password='${password}'`;
	await connection.query(sql, (err, result, fields) => {
		if (err) throw err;
		let idFieldName = "";
		switch (type.toUpperCase()) {
			case USER_TYPES.Doctor:
				idFieldName = "d_id";
				break;
			case USER_TYPES.Pharmacist:
				idFieldName = "ph_id";
				break;
			case USER_TYPES.Lab_Technician:
				idFieldName = "lt_id";
				break;
			case USER_TYPES.Patient:
				idFieldName = "pid";
				break;
			default:
				console.log("Unimplemented type");
		}
		sql = `SELECT * FROM ${type} WHERE ${idFieldName}='${result[0].person_id}'`;
		if (result.length == 0) res.status(404).send("User does not exist");
		connection.query(sql, (err, in_result, fields) => {
			if (err) throw err;
			if (in_result.length == 0)
				res.status(404).send("User does not exist");
			res.status(200).send({ ...in_result[0], ...result[0] });
		});
	});
});

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

// Get all Appointments for a patient
app.get("/appointments/:pid", (req, res) => {
	const p_id = req.params.p_id;
	const sql = `SELECT * FROM doc_visit NATURAL JOIN appointment WHERE p_id='${p_id}'`;
	connection.query(sql, (err, results) => {
		if (err) res.status(200).send(err);
		res.status(200).send(results);
	});
});

// Get diseases diagnosed for a particular appointment
app.get("/appointments/diseases/:appt_id", (req, res) => {
	const appt_id = req.params.appt_id;
	const sql 	  = `SELECT name FROM diagnosis WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
	});
});

// Get symptoms shared for a particular appointment
app.get("/appointments/symptoms/:appt_id", (req, res) => {
	const appt_id = req.params.appt_id;
	const sql     = `SELECT name, description FROM has_symptoms WHERE appt_id='${appt_id}'`;

	connection.query(sql, (err, results) => {
		if (err) {
			res.status(200).send(err);
		} else {
			res.status(200).send(results);
		}
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

// Assign test to technician
app.post("/tests/lt/assign", (req, res) => {
	const { t_id, appt_id } = req.body;

	// get all technicians with the same qualification
	const selectTechnicialSql = `SELECT lt_id
								 FROM lab_technician
								 WHERE expertise = ( SELECT expertise_required
													 FROM tests
													 WHERE t_id = '${t_id}')`;
	const componentNamesSql = `select c_name 
							   FROM components
							   WHERE t_id = '${t_id}'`;

	connection.query(selectTechnicialSql, (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			// Get a random one 
			const lt_id = results[(Math.random() * results.length) % results.length].lt_id;
			const assignTestSql = `INSERT INTO assigned_test(lt_id, appt_id, t_id) VALUES (?)`;
			const assignTestTuple = [lt_id, appt_id, t_id];
			const initCompResultsSql = `INSERT INTO component_result(c_id, c_name, t_id, appt_id, score) VALUES (?)`;
			
			connection.query(componentNamesSql, (err, results) => { //? I HATE CALLBACKS :'(
				if (err) {
					res.status(500).send(err);
				} else {
					connection.beginTransaction((err) => {
						if (err) {
							res.status(500).send(err);
						}
						
						// Assign lab technician
						connection.query(assignTestSql, assignTestTuple, (err, results) => {
							if (err) {
								connection.rollback();
								res.status(500).send(err);
							} else {
								// Initialize all components
								results.map((component, i) => {
									let initCompResultsTuple = [uuidv4(), component.c_name, t_id, appt_id, null];
									connection.query(initCompResultsSql, initCompResultsTuple, (err, results) => {
										if (err) {
											connection.rollback();
											res.status(500).send(err);
										} else {
											if (i == results.length - 1)
												res.status(200).send({ results }); //! This probably won't always work correctly :D
										}
									});
								});
							}
						});
						
					});
				}
			});

		}
	});
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
