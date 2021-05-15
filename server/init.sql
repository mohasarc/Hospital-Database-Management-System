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

CREATE TABLE manager(
    man_id VARCHAR(50),
    PRIMARY KEY (man_id),
    FOREIGN KEY (man_id) REFERENCES person(person_id)
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

CREATE TABLE department(
	name VARCHAR(50) NOT NULL,
	PRIMARY KEY (name)
);


CREATE TABLE doctor(
	d_id VARCHAR(50),
	dept_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    PRIMARY KEY(d_id),
    FOREIGN KEY (d_id) REFERENCES person(person_id),
    FOREIGN KEY (dept_name) REFERENCES department(name)
);

CREATE TABLE doc_schedule(
	d_id VARCHAR(50),
    unavail_date DATE,
    PRIMARY KEY(d_id, unavail_date),
    FOREIGN KEY (d_id) REFERENCES doctor(d_id) ON DELETE CASCADE
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
    UNIQUE (appt_id),
    PRIMARY KEY (d_id, date),
    FOREIGN KEY (d_id) REFERENCES doctor(d_id) ON DELETE CASCADE,
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

CREATE TABLE medicine(
	name VARCHAR(50),
	PRIMARY KEY (name)
);

CREATE TABLE pharmacy(
	phmcy_id VARCHAR(50),
	name VARCHAR(50),
	room_no INTEGER,
	PRIMARY KEY (phmcy_id)
);

CREATE TABLE phmcy_stores_med(
	name VARCHAR(50),
	phmcy_id VARCHAR(50),
    expiry_date DATE,	
	inventory_count INTEGER,
	PRIMARY KEY (name, phmcy_id, expiry_date),
	FOREIGN KEY (name) REFERENCES medicine(name),
	FOREIGN KEY (phmcy_id) REFERENCES pharmacy(phmcy_id)
);

CREATE TABLE works_at_phmcy(
	ph_id VARCHAR(50),
    phmcy_id VARCHAR(50),
    PRIMARY KEY (ph_id, phmcy_id),
    FOREIGN KEY (ph_id) REFERENCES pharmacist(ph_id),
    FOREIGN KEY (phmcy_id) REFERENCES pharmacy(phmcy_id)
);

CREATE TABLE prescription(
	appt_id VARCHAR(50),
    medicine_name VARCHAR(50),
    status VARCHAR(20),
    prescribed_date DATE,
    given_date DATE,
	PRIMARY KEY (appt_id, medicine_name),
	FOREIGN KEY (appt_id) REFERENCES appointment(appt_id),
	FOREIGN KEY (medicine_name) REFERENCES medicine(name)
);

CREATE TABLE lab(
	lab_id VARCHAR(50),
    room_no integer,
    PRIMARY KEY(lab_id)   
);

CREATE TABLE works_at_lab(
	lab_id VARCHAR(50),
    lt_id VARCHAR(50) NOT NULL,
    PRIMARY KEY(lab_id, lt_id),
    FOREIGN KEY (lab_id) REFERENCES lab(lab_id),
    FOREIGN KEY (lt_id) REFERENCES lab_technician(lt_id)
);

-- --------------------- TRIGGERS ------------------------
DROP TRIGGER IF EXISTS test_status_update;

DELIMITER $$
CREATE trigger test_status_update 
AFTER INSERT 
ON component_result FOR EACH ROW
BEGIN
	UPDATE assigned_test
    SET status = 
        CASE		
            WHEN (SELECT count(*) FROM component_result WHERE appt_id=new.appt_id AND t_id=new.t_id) = (SELECT count(*) FROM components WHERE t_id=new.t_id) THEN 'FINALIZED'
            WHEN (SELECT count(*) FROM component_result WHERE appt_id=new.appt_id AND t_id=new.t_id) <> 0 THEN 'PREPARING'                        
            else 'ASSIGNED'
        END
WHERE appt_id=new.appt_id AND t_id=new.t_id;
END$$
DELIMITER ;

-- ------------------ INIT MANAGEMENT ACCOUNT ---------------
INSERT INTO person VALUES ("1", "Super", "m.", "Manager", "2021-05-14", 1, "managers str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "manage@hospital.org", "verydifficultpassword");
INSERT INTO manager VALUES ("1");

-- ------------------ INIT DEPARTMENTS ---------------
INSERT INTO department VALUES ("Orthopaedics"), ("ENT"), ("Gynaecology&Obstetrics"), ("Chest&Vascular"), ("Paediatrics&Neonatology"), ("Psychiatry"), ("Accident&Emergency"), ("DentalSurgery");

-- ----------------- INIT LABS -----------------------
INSERT INTO lab VALUES ("1", 10);
INSERT INTO lab VALUES ("2", 20);
INSERT INTO lab VALUES ("3", 30);
INSERT INTO lab VALUES ("4", 40);

-- ------------------ INIT PHARMACIES ----------------
INSERT INTO pharmacy VALUES ("1", "AL-AKHAWAIN", 15);
INSERT INTO pharmacy VALUES ("2", "AL-KHAWAT", 25);
INSERT INTO pharmacy VALUES ("3", "AL-HIKMEH", 35);
INSERT INTO pharmacy VALUES ("4", "AL-NAWRAS", 45);

-- ------------------- INIT DISEASES -----------------
INSERT INTO diseases VALUES ("Cerebral palsy");
INSERT INTO diseases VALUES ("Chordoma");
INSERT INTO diseases VALUES ("Iron-deficiency anemia");
INSERT INTO diseases VALUES ("Hepatitis C");
INSERT INTO diseases VALUES ("Lyme disease");
INSERT INTO diseases VALUES ("Metastatic cancer");
INSERT INTO diseases VALUES ("Non-gonococcal urethritis");
INSERT INTO diseases VALUES ("Parkinson's disease");

-- ------------------ INIT SYMPTOMS ------------------
INSERT INTO symptoms VALUES ("abdomen pain");
INSERT INTO symptoms VALUES ("back pain");
INSERT INTO symptoms VALUES ("chest pain");
INSERT INTO symptoms VALUES ("ear pain");
INSERT INTO symptoms VALUES ("head pain");
INSERT INTO symptoms VALUES ("pelvis pain");
INSERT INTO symptoms VALUES ("feels chills");
INSERT INTO symptoms VALUES ("feels fever");
INSERT INTO symptoms VALUES ("feels Paresthesia");

-- ------------------ INIT PATIENTS ------------------
INSERT INTO person VALUES ("2", "Patient 1", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat1@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("3", "Patient 2", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat2@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("4", "Patient 3", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat3@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("5", "Patient 4", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat4@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("6", "Patient 5", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat5@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("7", "Patient 6", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat6@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("8", "Patient 7", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat7@sick.org", "verydifficultpassword");
INSERT INTO person VALUES ("9", "Patient 8", "m.", "Jack", "2021-05-14", 1, "patients str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "pat8@sick.org", "verydifficultpassword");

INSERT INTO patient VALUES ("2", 150, 60, "B+", "2021-05-15");
INSERT INTO patient VALUES ("3", 160, 70, "A+", "2021-05-15");
INSERT INTO patient VALUES ("4", 170, 90, "O+", "2021-05-15");
INSERT INTO patient VALUES ("5", 180, 100, "B-", "2021-05-15");
INSERT INTO patient VALUES ("6", 190, 100, "A-", "2021-05-15");
INSERT INTO patient VALUES ("7", 200, 90, "O-", "2021-05-15");
INSERT INTO patient VALUES ("8", 210, 110, "AB+", "2021-05-15");
INSERT INTO patient VALUES ("9", 210, 110, "AB-", "2021-05-15");

-- ------------------ INIT DOCTORS -------------------
INSERT INTO person VALUES ("10", "Doc 1", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "doc1@hospital.org", "verydifficultpassword");
INSERT INTO person VALUES ("11", "Doc 2", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "doc2@hospital.org", "verydifficultpassword");
INSERT INTO person VALUES ("12", "Doc 3", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "doc3@hospital.org", "verydifficultpassword");
INSERT INTO person VALUES ("13", "Doc 4", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "doc4@hospital.org", "verydifficultpassword");

INSERT INTO doctor VALUES ("10", "Orthopaedics", "Dermatologist", "very qualified");
INSERT INTO doctor VALUES ("11", "Gynaecology&Obstetrics", "Gynaecology", "very qualified");
INSERT INTO doctor VALUES ("12", "Chest&Vascular", "Vascular", "very qualified");
INSERT INTO doctor VALUES ("13", "Accident&Emergency", "Emergency", "very qualified");

-- ----------------- INIT LAB TECH -------------------
INSERT INTO person VALUES ("14", "Tech 1", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "tech1@hospital.org", "verydifficultpassword");
INSERT INTO person VALUES ("15", "Tech 2", "m.", "Jack", "2021-05-14", 1, "Docs str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "tech2@hospital.org", "verydifficultpassword");

INSERT INTO lab_technician VALUES ("14", "experty 1");
INSERT INTO lab_technician VALUES ("15", "experty 2");

INSERT INTO works_at_lab VALUES ("1", "14");
INSERT INTO works_at_lab VALUES ("2", "15");
-- ------------- INIT PHARMACISTS ----------------
INSERT INTO person VALUES ("16", "Phar 1", "m.", "Jack", "2021-05-14", 1, "Pharmacists str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "phar1@hospital.org", "verydifficultpassword");
INSERT INTO person VALUES ("17", "Phar 2", "m.", "Jack", "2021-05-14", 1, "Pharmacists str.", 1, "Hospital", "Hospital", 1, "Turkey", "+90", "000000000", "other", "phar2@hospital.org", "verydifficultpassword");

INSERT INTO pharmacist VALUES ("16", "qual 1");
INSERT INTO pharmacist VALUES ("17", "qual 1");

INSERT INTO works_at_phmcy VALUES ("16", "1");
INSERT INTO works_at_phmcy VALUES ("17", "2");

-- ------------------ INIT DOC SCHEDULE --------------
INSERT INTO doc_schedule VALUES ("10", "2021-05-10");
INSERT INTO doc_schedule VALUES ("10", "2021-05-15");
INSERT INTO doc_schedule VALUES ("10", "2021-05-22");
INSERT INTO doc_schedule VALUES ("10", "2021-05-25");

INSERT INTO doc_schedule VALUES ("11", "2021-05-10");
INSERT INTO doc_schedule VALUES ("11", "2021-05-12");

-- ---------------- INIT APPOINTMENTS ----------------
INSERT INTO appointment VALUES ("1", "10", "2", "2021-05-11", "ONGONIG", "an appt");
INSERT INTO appointment VALUES ("2", "11", "3", "2021-05-13", "ONGONIG", "an appt");

INSERT INTO appointment VALUES ("3", "12", "4", "2021-05-10", "ONGONIG", "an appt");
INSERT INTO appointment VALUES ("4", "13", "5", "2021-05-10", "ONGONIG", "an appt");

-- day 2021-05-10 is blocked 2 doc unavail and 2 docs have appt

-- ---------------- INIT MEDICINES -------------------
INSERT INTO medicine VALUES ("medimol");
INSERT INTO medicine VALUES ("paromol");
INSERT INTO medicine VALUES ("pedomol");
INSERT INTO medicine VALUES ("oredomol");
INSERT INTO medicine VALUES ("asadomol");
INSERT INTO medicine VALUES ("lekomol");

-- ---------------- INIT PHARMACY INVENTORY ----------
INSERT INTO phmcy_stores_med VALUES("medimol", "1", "2023-01-01", 100);
INSERT INTO phmcy_stores_med VALUES("medimol", "1", "2024-01-01", 150);
INSERT INTO phmcy_stores_med VALUES("paromol", "1", "2023-01-01", 5);
INSERT INTO phmcy_stores_med VALUES("oredomol", "1", "2024-01-01", 17);
INSERT INTO phmcy_stores_med VALUES("lekomol", "1", "2024-01-01", 300);
