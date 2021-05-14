const express = require('express');
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { connection } = require('../../index');
const { USER_TYPES } = require("../../constants");

router.post("/signup", async (req, res) => {
	const { first_name, middle_name, last_name, dob, apt_num, street_name, street_num, city,
            state, zip, country, country_code, number, gender, e_mail, password, type,
	} = req.body;

	let sql = `INSERT INTO person (person_id, first_name, middle_name, last_name, dob, 
               apt_num, street_name, street_num, city, state, zip, country, country_code, 
               number, gender, e_mail, password) VALUES (?)`;

	const person_id = uuidv4();
	let tuple = [ person_id, first_name, middle_name, last_name, dob, apt_num, street_name,
		street_num, city, state, zip, country, country_code, number, gender, e_mail, password,
	];

	connection.query(sql, [tuple], async (err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
            if (type && type.toUpperCase() == USER_TYPES.Patient) {
                sql = "INSERT INTO patient (pid, height, weight, blood_group, registration_date) VALUES (?)";
                const { height, weight, blood_group } = req.body;
                const height_int = parseFloat(height);
                const weight_int = parseFloat(weight);
                const registration_date = moment(new Date()).format( "YYYY-MM-DD" );
                tuple = [ person_id, height_int, weight_int, blood_group, registration_date ];

                connection.query(sql, [tuple], (error, result) => {
                    if (error) {
                        sql = `DELETE FROM person WHERE person_id='${person_id}'`; //! This can be problematic in case it fails
                        connection.query(sql, (error, result) => {}); //! no checks are available
                        res.status(500).send(error);
                    } else {
                        res.status(200).send("Patient Inserted successfully!");
                    }
                });
            }
            res.status(200).send("Person inserted successfully");
        }
	});
});

router.post("/login", async (req, res) => {
	const { e_mail, password, type } = req.body;
	let sql = `SELECT * FROM person WHERE e_mail='${e_mail}' AND password='${password}'`;
	connection.query(sql, (err, result, fields) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length < 1){
            res.status(500).send("Wrong credentials!");
        } else {
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
                case USER_TYPES.Manager:
                    idFieldName = 'man_id';
                    break;
                default:
                    res.status(500).send("Unimplemented type");
                   return;
            }

            sql = `SELECT * FROM ${type.toLowerCase()} WHERE ${idFieldName}='${result[0].person_id}'`;
            if (result.length == 0) {
                res.status(404).send("User does not exist");
            } else {
                connection.query(sql, (err, in_result, fields) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (in_result.length == 0) {
                            res.status(404).send(`${type.toLowerCase()} does not exist`);
                        } else {
                            res.status(200).send({ ...in_result[0], ...result[0] });
                        }
                    }
                });
            }
        }
	});
});

module.exports = router