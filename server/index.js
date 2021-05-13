const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv");
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
const authentication = require("./api/authentication/authentication");
const appointment = require("./api/appointment/appointment");
const medicine = require("./api/management/medicine");
const symptom = require("./api/management/symptom");
const disease = require("./api/management/disease");
const test = require("./api/management/test");

app.use("/auth", authentication);
app.use("/appointment", appointment);
app.use("/management", medicine, symptom, disease, test);

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
