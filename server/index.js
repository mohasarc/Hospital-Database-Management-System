const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql");
const moment = require("moment");

const USER_TYPES = require("./constants");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
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
	const { first_name, middle_name, last_name, dob, apt_num, street_name, street_num, city, state, zip, country, country_code, number, gender, e_mail, password, type, } = req.body;
	let sql = "INSERT INTO person (person_id, first_name, middle_name, last_name, dob, apt_num, street_name, street_num, city, state, zip, country, country_code, number, gender, e_mail, password) VALUES (?)";
	const person_id = uuidv4();
	let tuple = [ person_id, first_name, middle_name, last_name, dob, apt_num, street_name, street_num, city, state, zip, country, country_code, number, gender, e_mail, password, ];
	await connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			console.log("error");
		}
		switch (type.toUpperCase()) {
			case USER_TYPES.Doctor: {
				sql = "INSERT INTO doctor (d_id, dept_name, specialization, qualification) VALUES (?)";
				const { dept_name, specialization, qualification } = req.body;
				tuple = [ person_id, dept_name, specialization, qualification ];
				await connection.query(sql, [tuple], (error, result) => {
					if (error) {
						sql = `DELETE FROM person WHERE person_id='${person_id}'`;
						console.log(error);
					}
				});
			}
				break;
			case USER_TYPES.Pharmacist: {
				sql = "INSERT INTO pharmacist (ph_id, qualifications) VALUES (?)";
				const { qualifications } = req.body;
				tuple = [person_id, qualifications];
				await connection.query(sql, [tuple], (error, result) => {
					if (error) {
						sql = `DELETE FROM person WHERE person_id='${person_id}'`;
						console.log(error);
					}
				});
			}
				break;
			case USER_TYPES.Lab_Technician: {
				const { expertise } = req.body;
				sql = "INSERT INTO lab_technician (lt_id, expertise) VALUES (?);";
				tuple = [person_id, expertise];
				await connection.query(sql, [tuple], (error, result) => {
					if (error) {
						sql = `DELETE FROM person WHERE person_id='${person_id}'`;
						console.log(error);
					}
				});
			}
				break;
			case USER_TYPES.Patient: {
				sql = "INSERT INTO patient (pid, height, weight, blood_group, registration_date) VALUES (?)";
				const { height, weight, blood_group } = req.body;
				const height_int = parseFloat(height);
				const weight_int = parseFloat(weight);
				let registration_date = moment(new Date()).format("YYYY-MM-DD");
				tuple = [ person_id, height_int, weight_int, blood_group, registration_date];
				await connection.query(sql, [tuple], (error, result) => {
					if (error) {
						sql = `DELETE FROM person WHERE person_id='${person_id}'`;
						console.log(error);
					}
				});
			}
				break;
			default:
				console.log("Unimplemented type");
		}
		res.status(200).send("Successfully Inserted");
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
			if (in_result.length == 0) res.status(404).send("User does not exist"); 
			res.status(200).send({ ...in_result[0], ...result[0] });
		})
	});
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
