DROP DATABASE hospitaldb;
CREATE DATABASE hospitaldb;
USE hospitaldb;

CREATE TABLE person(
	person_id VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50), 
    last_name VARCHAR(50) NOT NULL, 
    dob DATE, 
    apt_num INT, 
    street_name VARCHAR(100),
    street_num INT, 
    city VARCHAR(25), 
    state VARCHAR(25), 
    zip INT, 
    country VARCHAR(25), 
    country_code  VARCHAR(5), 
    number VARCHAR(20), 
    gender VARCHAR(10), 
    e_mail VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (person_id)
);

CREATE TABLE pharmacist(
	ph_id VARCHAR(50),
	qualifications VARCHAR(100) NOT NULL,
    PRIMARY KEY(ph_id),
    FOREIGN KEY (ph_id) REFERENCES person(person_id)
);

CREATE TABLE patient(
	pid VARCHAR(50),
    height NUMERIC(5, 2), 
    weight NUMERIC(5, 2), 
    blood_group CHAR(3),
    registration_date date NOT NULL,
    PRIMARY KEY (pid),
    FOREIGN KEY (pid) REFERENCES person(person_id)
);

CREATE TABLE doctor(
	d_id VARCHAR(50),
	dept_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    PRIMARY KEY(d_id),
    FOREIGN KEY (d_id) REFERENCES person(person_id)
);

CREATE TABLE lab_technician(
	lt_id VARCHAR(50),
    expertise VARCHAR(50) NOT NULL,
    PRIMARY KEY(lt_id),
    FOREIGN KEY (lt_id) REFERENCES person(person_id)
);