const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require('cors')

const { COMP_SCORE, TEST_STATUS } = require("./constants");
const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors());

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
const appointment = require("./api/appointment/appointment");
const appt_diagnosis = require("./api/appointment/diagnosis");
const appt_symptoms = require("./api/appointment/symptoms");
const appt_tests = require("./api/appointment/tests");
const appt_prescription = require("./api/appointment/prescription");
const authentication = require("./api/authentication/authentication");

const disease_man = require("./api/management/disease");
const dept_man = require("./api/management/department/department");
const doctor_man = require("./api/management/employee/doctor");
const labTechnician_man = require("./api/management/employee/lab_technician");
const medicine_man = require("./api/management/pharmacy/medicine");
const pharmacist_man = require("./api/management/employee/pharmacist");
const pharmacy_man = require("./api/management/pharmacy/pharmacy");
const symptom_man = require("./api/management/symptom");
const test_man = require("./api/management/laboratory/test");
const department = require("./api/management/department/department");

const doctor = require("./api/doctor");
const lab = require("./api/lab");
const patient = require("./api/patient");
const person = require("./api/person");
const pharmacy_inventory = require("./api/pharmacy_inventory");

app.use("/auth", authentication);
app.use("/appointment", appointment, appt_diagnosis, appt_symptoms, appt_tests, appt_prescription);
app.use('/doctor', doctor);
app.use('/laboratory', lab);
app.use('/patient', patient);
app.use('/person', person);
app.use("/pharmacy_inventory", pharmacy_inventory);
app.use("/management/employee", doctor_man, pharmacist_man, labTechnician_man)
app.use("/management", medicine_man, symptom_man, disease_man, test_man, pharmacy_man, dept_man);

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
