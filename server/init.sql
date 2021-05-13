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

CREATE TABLE appointment(
	appt_id VARCHAR(50),
    d_id VARCHAR(50),
    p_id VARCHAR(50),
	date DATE,
	status VARCHAR(20),
    description VARCHAR(200),
    PRIMARY KEY (appt_id),
    FOREIGN KEY (d_id) REFERENCES doctor(d_id),
    FOREIGN KEY (p_id) REFERENCES patient(pid)
);

CREATE TABLE symptoms(
    name VARCHAR(100),
    PRIMARY KEY(name)
);

CREATE TABLE diseases(
    name VARCHAR(100),
    PRIMARY KEY(name)
);

CREATE TABLE has_symptoms(
    appt_id VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(250),
    PRIMARY KEY (name, appt_id),
    FOREIGN KEY (appt_id) REFERENCES appointment(appt_id),
    FOREIGN KEY (name) REFERENCES symptoms(name)

);

CREATE TABLE diagnosis(
    appt_id VARCHAR(50),
    name VARCHAR(100),
    description VARCHAR(250),
    PRIMARY KEY (name, appt_id),
    FOREIGN KEY (appt_id) REFERENCES appointment(appt_id),
    FOREIGN KEY (name) REFERENCES diseases(name)
);

CREATE TABLE test(
	t_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    expertise_required VARCHAR(20),      
    PRIMARY KEY (t_id)
);

CREATE TABLE components(
    c_id VARCHAR(50) NOT NULL,
    c_name VARCHAR(50) NOT NULL,    
    t_id VARCHAR(50) NOT NULL,
	min_interval integer NOT NULL,
	max_interval integer NOT NULL,
    PRIMARY KEY (c_id),
    FOREIGN KEY (t_id) REFERENCES test(t_id)
);

CREATE TABLE component_result(
    c_id VARCHAR(50) NOT NULL,  
    t_id VARCHAR(50) NOT NULL,
	appt_id VARCHAR(50),
	score integer,
    PRIMARY KEY (c_id, t_id, appt_id),
    FOREIGN KEY (c_id) REFERENCES components(c_id),
    FOREIGN KEY (t_id) REFERENCES test(t_id),
    FOREIGN KEY (appt_id) REFERENCES appointment(appt_id)
);

CREATE TABLE assigned_test(
	lt_id VARCHAR(50),
	appt_id VARCHAR(50),
	t_id VARCHAR(100),
    status VARCHAR(20),
	PRIMARY KEY (lt_id, appt_id, t_id),
	FOREIGN KEY (appt_id) REFERENCES appointment(appt_id),
	FOREIGN KEY (lt_id) REFERENCES lab_technician(lt_id),
	FOREIGN KEY (t_id) REFERENCES test(t_id)
);