const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "hospitaldb",
});

const PORT = 8000;

connection.connect();

app.post("/", (req, res) => {
	res.send("Hello World")
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});
