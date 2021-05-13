const express = require('express')
const router = express.Router()
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
            switch (type.toUpperCase()) {
                case USER_TYPES.Doctor:
                    {
                        sql = "INSERT INTO doctor (d_id, dept_name, specialization, qualification) VALUES (?)";
                        const { dept_name, specialization, qualification } = req.body;
                        tuple = [ person_id, dept_name, specialization, qualification ];

                        connection.query(sql, [tuple], (error, result) => {
                            if (error) {
                                sql = `DELETE FROM person WHERE person_id='${person_id}'`; //! This can be problematic in case it fails
                                connection.query(sql, (error, result) => {}); //! no checks are available
                                res.status(500).send(error);
                            } else {
                                res.status(200).send("Doctor Inserted successfully!");
                            }
                        });
                    }
                    break;
                case USER_TYPES.Pharmacist:
                    {
                        sql = "INSERT INTO pharmacist (ph_id, qualifications) VALUES (?)";
                        const { qualifications } = req.body;
                        tuple = [person_id, qualifications];

                        connection.query(sql, [tuple], (error, result) => {
                            if (error) {
                                sql = `DELETE FROM person WHERE person_id='${person_id}'`; //! same problem as above
                                connection.query(sql, (error, result) => {}); 
                                res.status(500).send(error);
                            } else {
                                res.status(200).send("Pharmacist Inserted successfully!");
                            }
                        });
                    }
                    break;
                case USER_TYPES.Lab_Technician:
                    {
                        const { expertise } = req.body;
                        sql = "INSERT INTO lab_technician (lt_id, expertise) VALUES (?);";
                        tuple = [person_id, expertise];
                        connection.query(sql, [tuple], (error, result) => {
                            if (error) {
                                sql = `DELETE FROM person WHERE person_id='${person_id}'`; //! same problem as above
                                connection.query(sql, (error, result) => {});
                                res.status(500).send(error);
                            } else {
                                res.status(200).send("Lab Technician Inserted successfully!");
                            }
                        });
                    }
                    break;
                case USER_TYPES.Patient:
                    {
                        sql = "INSERT INTO patient (pid, height, weight, blood_group, registration_date) VALUES (?)";
                        const { height, weight, blood_group } = req.body;
                        const height_int = parseFloat(height);
                        const weight_int = parseFloat(weight);
                        const registration_date = moment(new Date()).format( "YYYY-MM-DD" );
                        tuple = [ person_id, height_int, weight_int, blood_group, registration_date ];

                        connection.query(sql, [tuple], (error, result) => {
                            if (error) {
                                sql = `DELETE FROM person WHERE person_id='${person_id}'`; //! same problem as above
                                connection.query(sql, (error, result) => {});
                                console.log(error);
                                res.status(500).send(error);
                            } else {
                                res.status(200).send("Patient Inserted successfully!");
                            }
                        });
                    }
                    break;
                default:
                    {
                        res.status(500).send("Unimplemented type");
                    }
            }
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