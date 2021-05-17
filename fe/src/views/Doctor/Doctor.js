import { H3, H5 } from "@blueprintjs/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from "axios";
import React, { PureComponent } from "react";
import { Jumbotron, Row, Col, Container, Form, Card, ListGroup, FormControl } from 'react-bootstrap';
import Loading from "../Loading";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
import { Alignment, Button, Classes, Divider, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, InputGroup, FormGroup } from "@blueprintjs/core";
import { USER_PROPERTIES } from "../Patient/UserProperties";

const moment = require("moment");
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const TABS = {
    PERSONAL_INFO: { value: "PERSONAL_INFORMATION", text: "Personal Information" },
    ALL_APPOINTMENTS: { value: "APPOINTMENTS", text: "All Appointments" },
    CURRENT_APPOINTMENT: { value: "CURRENT_APPOINTMENT", text: "Current Appointment" },
    APPOINTMENT_DETAILS: { value: "APPOINTMENT_DETAILS", text: "Appointment Details" },
}

class Doctor extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            appointments: [],
            datesUnavailable: [],
            symptoms: [],
            diagnosis: [],
            tests: [],
            prescription: [],
            testsNotSelected: [],
            symptomsNotSelected: [],
            diseasesNotDiagnosed: [],
            medicinesNotPrescribed: [],
            selectedSymptom: "",
            selectedDisease: "",
            selectedTest: "",
            selectedMedicine: "",
            symptomDescription: "",
            diseaseDescription: "",
            docName: "",
            deptName: undefined,
            detailAppt: {},
            activePage: TABS.ALL_APPOINTMENTS.value,
            ...JSON.parse(localStorage.getItem("user")),
        };
	}

	componentDidMount() {
        if (!localStorage.getItem("user") || !this.state.hasOwnProperty("d_id")) {
            this.props.history.push("/login");
        }
        this.fetchAllAppointments();
        this.fetchAllUnavailableDates();
	}

    fetchAllAppointments = () => {
        this.setState({ loading: true }, async () => {
            const TODAY_DATE = moment(new Date()).format("YYYY-MM-DD");
            const NEXT_MONTH_DATE = moment((new Date()).addDays(30)).format("YYYY-MM-DD");
            const { d_id } = this.state;
			const appointments = (await axios.get(`http://localhost:8000/doctor/appointment/${d_id}/${TODAY_DATE}/${NEXT_MONTH_DATE}`)).data;
            this.setState({ loading: false, appointments });
		});
    }

    fetchAllUnavailableDates = () => {
        this.setState({ loading: true }, async () => {
            const { d_id } = this.state;
			const datesUnavailable = (await axios.get(`http://localhost:8000/doctor/unavailable_date/${d_id}`)).data;
            this.setState({ loading: false, datesUnavailable });
		});
    }

    fetchApptSymptoms = async (appt_id) => {
        const symptoms = (await axios.get(`http://localhost:8000/appointment/symptom/${appt_id}`)).data;
        console.log("symptoms: ", symptoms);
        this.setState({ symptoms });
    }

    fetchApptDiagnosis = async (appt_id) => {
        const diagnosis = (await axios.get(`http://localhost:8000/appointment/diagnosis/${appt_id}`)).data;
        console.log("diagnosis: ", diagnosis);

        this.setState({ diagnosis });
    }

    fetchApptTests = async (appt_id) => {
        const tests = (await axios.get(`http://localhost:8000/appointment/test/${appt_id}`)).data;
        console.log("tests: ", tests);
        this.setState({ tests });
    }

    fetchApptPrescription = async (appt_id) => {
        const prescription = (await axios.get(`http://localhost:8000/appointment/prescription/${appt_id}`)).data;
        console.log("prescription: ", prescription);
        this.setState({ prescription });
    }
    
    fetchTestsNotSelected = async (appt_id) => {
        const testsNotSelected = (await axios.get(`http://localhost:8000/management/test/${appt_id}`)).data;
        console.log("testsNotSelected: ", testsNotSelected);
        this.setState({ testsNotSelected });
    }
    
    fetchDiseasesNotDiagnosed = async (appt_id) => {
        const diseasesNotDiagnosed = (await axios.get(`http://localhost:8000/management/disease/${appt_id}`)).data;
        console.log("diseasesNotDiagnosed: ", diseasesNotDiagnosed);
        this.setState({ diseasesNotDiagnosed });
    }

    fetchsymptomsNotSelected = async (appt_id) => {
        const symptomsNotSelected = (await axios.get(`http://localhost:8000/management/symptom/${appt_id}`)).data;
        console.log("symptomsNotSelected: ", symptomsNotSelected);
        this.setState({ symptomsNotSelected });
    }

    fetchMedicinesNotPrescribed = async (appt_id) => {
        const medicinesNotPrescribed = (await axios.get(`http://localhost:8000/management/medicine/${appt_id}`)).data;
        console.log("medicinesNotPrescribed: ", medicinesNotPrescribed);
        this.setState({ medicinesNotPrescribed });
    }

    isUnavailalbe = (date) => {
        const { datesUnavailable } = this.state;
        let unavailable = false;

        datesUnavailable.map ( unavaiDate => {
            if (moment(unavaiDate.unavail_date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")) {
                unavailable = true;
            }
        });

        return unavailable;
    }

    hasAppt = (date) => {
        const { appointments } = this.state;
        let unavailable = false;

        appointments.map ( appt => {
            if (moment(appt.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")) {
                unavailable = true;
            }
        });

        return unavailable;
    }


    addSymptom = async (selectedSymptom, symptomDescription, appt_id) => {
        console.log("sss", selectedSymptom, symptomDescription,appt_id);
        if (selectedSymptom && symptomDescription) {
            try {
                await axios.post(`http://localhost:8000/appointment/symptom`, {appt_id, name: selectedSymptom, description: symptomDescription});
                this.fetchApptSymptoms(appt_id);
                this.fetchsymptomsNotSelected(appt_id);
            } catch (error) {
                console.log(error)
            }
        }
    }

    removeSymptom = async (name, appt_id) => {
        console.log(name);
        try {
            await axios.delete(`http://localhost:8000/appointment/symptom/${appt_id}/${name}`);
            this.fetchApptSymptoms(appt_id);
            this.fetchsymptomsNotSelected(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    addTest = async (t_id, appt_id) => {
        try {
            console.log("adding test: ", t_id, appt_id)
            await axios.post(`http://localhost:8000/appointment/test`,{appt_id, t_id});
            this.fetchApptTests(appt_id);
            this.fetchTestsNotSelected(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    removeTest = async (t_id, appt_id) => {
        try {
            await axios.delete(`http://localhost:8000/appointment/test/${appt_id}/${t_id}`);
            this.fetchApptTests(appt_id);
            this.fetchTestsNotSelected(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    addDisease = async (name, description, appt_id) => {
        try {
            await axios.post(`http://localhost:8000/appointment/diagnosis`,{appt_id, name, description});
            this.fetchApptDiagnosis(appt_id);
            this.fetchDiseasesNotDiagnosed(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    removeDisease = async (name, appt_id) => {
        try {
            await axios.delete(`http://localhost:8000/appointment/diagnosis/${appt_id}/${name}`);
            this.fetchApptDiagnosis(appt_id);
            this.fetchDiseasesNotDiagnosed(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    addMedicine = async (name, appt_id) => {
        try {
            await axios.post(`http://localhost:8000/appointment/prescription`,{appt_id, name});
            this.fetchApptPrescription(appt_id);
            this.fetchMedicinesNotPrescribed(appt_id);
        } catch (error) {
            console.log(error)
        }
    }

    removeMedicine = async (name, appt_id) => {
        try {
            await axios.delete(`http://localhost:8000/appointment/prescription/${appt_id}/${name}`);
            this.fetchApptPrescription(appt_id);
            this.fetchMedicinesNotPrescribed(appt_id);
        } catch (error) {
            console.log(error)
        }
    }
    
    makeDayOff = async (date) => {
        const { d_id } = this.state;
        let yes;

        if (this.isUnavailalbe(date)) {
            yes = window.confirm("Do you want to mark this day as available?");
            if (date && yes) {
                try {
                    date = moment((date)).format("YYYY-MM-DD");
                    await axios.post(`http://localhost:8000/doctor/available_date`, {d_id, date});
                    this.fetchAllUnavailableDates();
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            yes = window.confirm("Do you want to mark this day as off day?");
            if (date && yes) {
                try {
                    date = moment((date)).format("YYYY-MM-DD");
                    await axios.post(`http://localhost:8000/doctor/unavailable_date`, {d_id, date});
                    this.fetchAllUnavailableDates();
                } catch (error) {
                    console.log(error)
                }
            }
        }

    }

    cancelAppt = async (apptInfo) => {
        let yes = window.confirm("Are you sure you want to cancel this appointment?");

        if (apptInfo && yes) {
            const {appt_id} = apptInfo;
            console.log("appt_id", appt_id);
            try {
                await axios.patch(`http://localhost:8000/appointment`, {appt_id});
                this.fetchAllAppointments();
            } catch (error) {
                console.log(error)
            }
        }
    }

    endAppt = async (appt_id) => {
        let yes = window.confirm("Are you sure you want to end this appointment?");

        if (yes) {
            console.log("appt_id", appt_id);
            try {
                await axios.patch(`http://localhost:8000/appointment/end`, {appt_id});
                this.fetchAllAppointments();
            } catch (error) {
                console.log(error)
            }
        }
    }

    renderView = () => {
        const { activePage } = this.state;
        switch(activePage) {
            case TABS.ALL_APPOINTMENTS.value:
                return this.renderAllAppointments();
            case TABS.CURRENT_APPOINTMENT.value:
                return this.renderCurAppointment();
            case TABS.PERSONAL_INFO.value: 
                return this.renderDocInformation();
            case TABS.APPOINTMENT_DETAILS.value:
                return this.renderAppointmentDetails();
        }
    }

    renderAllAppointments = () => {
        return (
            <>
                <H5>All appointments</H5>
                <TableContainer key={this.state.appointments.length} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Appointment date</TableCell>
                            <TableCell align="left">Patient's name</TableCell>
                            <TableCell align="left">Patient's age </TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.appointments.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
                                <TableCell component="th" scope="row">{row.first_name + ' ' + row.middle_name + ' ' + row.last_name}</TableCell>
                                <TableCell component="th" scope="row">{calculateAge(new Date(row.dob))}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Button onClick={() => {this.cancelAppt(row)}}>cancel</Button>
                                    <Button onClick={() => {this.setState({ activePage: TABS.APPOINTMENT_DETAILS.value, detailAppt: row })}} >details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }

    renderCurAppointment = () => {
        const { appointments } = this.state;
        var todayAppt;
        
        appointments.map(( appt ) => {
            if (moment(appt.date).format("YYYY-MM-DD") == moment(new Date).format("YYYY-MM-DD"))
                todayAppt = appt;
        });

        if (!todayAppt)
            return <></>;

        return (
            <>
            <H5>Current Appointment</H5>
            <Card>
                <Card.Header>Petient Info</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Name: {todayAppt.first_name + ' ' + todayAppt.middle_name + ' ' + todayAppt.last_name}</ListGroup.Item>
                    <ListGroup.Item>Age: {calculateAge(new Date(todayAppt.dob))}</ListGroup.Item>
                    <ListGroup.Item>Country: {todayAppt.country}</ListGroup.Item>
                </ListGroup>
            </Card>
            <br/>
            {/**********************************************************************************/}
            {/*                                   Symptoms                                     */}
            {/**********************************************************************************/}
            <H5>Symptoms</H5>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Symptom</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody  key={this.state.symptoms.length}>
                        {this.state.symptoms.map((symptom) => (
                            <TableRow key={symptom.name}>
                                <TableCell component="th" scope="row">{symptom.name}</TableCell>
                                <TableCell component="th" scope="row">{symptom.description}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Button onClick={() => {this.removeSymptom(symptom.name, todayAppt.appt_id)}}>-</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell key={this.state.symptomsNotSelected.length} component="th" scope="row">
                                <Form.Control onChange={(e)=> this.setState({selectedSymptom: e.target.value})} size="sm" as="select">
                                    {
                                        this.state.symptomsNotSelected.map((symptom, i) => {
                                            if (i == 0) this.setState({selectedSymptom: symptom.name});
                                            return <option>{symptom.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Form.Control size="sm" type="text" placeholder="Description" onChange={(e) => this.setState({symptomDescription:e.target.value})}/>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => this.addSymptom(this.state.selectedSymptom, this.state.symptomDescription, todayAppt.appt_id)} >+</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            {/**********************************************************************************/}
            {/*                                   Tests                                        */}
            {/**********************************************************************************/}
            <H5>Tests</H5>
            <TableContainer component={Paper}>
                <Table key={this.state.tests.length + this.state.testsNotSelected.length} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Test</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.tests.map((test) => (
                        <TableRow key={test.name}>
                            <TableCell component="th" scope="row">{test.name}</TableCell>
                            <TableCell component="th" scope="row">{test.status}</TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => {this.removeTest(test.t_id, todayAppt.appt_id)}}>-</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                            <TableCell component="th" scope="row">
                                <Form.Control onChange={(e)=> {
                                                                let t_id;
                                                                this.state.testsNotSelected.map((test, i) => {
                                                                    if (test.name == e.target.value)
                                                                        t_id = test.t_id;
                                                                });
                                                                this.setState({selectedTest: t_id})}
                                                                }  size="sm" as="select">
                                    {
                                        this.state.testsNotSelected.map((test, i) => {
                                            if (i == 0) this.setState({selectedTest: test.t_id});
                                            return <option>{test.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => this.addTest(this.state.selectedTest, todayAppt.appt_id)} >+</Button>
                            </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            {/**********************************************************************************/}
            {/*                                   Diagnosis                                    */}
            {/**********************************************************************************/}
            <H5>Diagnosis</H5>
            <TableContainer component={Paper}>
                <Table key={this.state.diagnosis.length + this.state.diseasesNotDiagnosed.length} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Disease</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.diagnosis.map((disease) => (
                        <TableRow key={disease.name}>
                            <TableCell component="th" scope="row">{disease.name}</TableCell>
                            <TableCell component="th" scope="row">{disease.description}</TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => {this.removeDisease(disease.name, todayAppt.appt_id)}}>-</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                        <TableRow>
                            <TableCell key={this.state.diseasesNotDiagnosed.length} component="th" scope="row">
                                <Form.Control onChange={(e)=> this.setState({selectedDisease: e.target.value})} size="sm" as="select">
                                    {
                                        this.state.diseasesNotDiagnosed.map((disease, i) => {
                                            if (i == 0) this.setState({selectedDisease: disease.name});
                                            return <option>{disease.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Form.Control size="sm" type="text" placeholder="Description" onChange={(e) => this.setState({diseaseDescription:e.target.value})}/>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => this.addDisease(this.state.selectedDisease, this.state.diseaseDescription, todayAppt.appt_id)} >+</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            {/**********************************************************************************/}
            {/*                                   PRESCRIPTION                                 */}
            {/**********************************************************************************/}
            <H5>Prescription</H5>
            <TableContainer component={Paper}>
                <Table key={this.state.prescription.length + this.state.medicinesNotPrescribed.length} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Medicine name</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.prescription.map((medicine) => (
                        <TableRow key={medicine.name}>
                            <TableCell component="th" scope="row">{medicine.name}</TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => {this.removeMedicine(medicine.name, todayAppt.appt_id)}}>-</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                            <TableCell component="th" scope="row">
                                <Form.Control  onChange={(e)=> this.setState({selectedMedicine: e.target.value})}  size="sm" as="select">
                                    {
                                        this.state.medicinesNotPrescribed.map((medicine, i) => {
                                            if (i == 0) this.setState({selectedMedicine: medicine.name});
                                            return <option>{medicine.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </TableCell>
                            <TableCell component="th" scope="row">
                            <Button onClick={() => this.addMedicine(this.state.selectedMedicine, todayAppt.appt_id)} >+</Button>
                            </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            <TableContainer>
                <Button onClick={() => {this.endAppt(todayAppt.appt_id)}}>End appointment</Button>
            </TableContainer>
            </>
        );
    }

    renderAppointmentDetails = () => {
        const {detailAppt} = this.state;
        return (
            <>
                <H5>Appointment Details</H5>
                <Card>
                    <Card.Header>Petient Info</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Name: {detailAppt.first_name + ' ' + detailAppt.middle_name + ' ' + detailAppt.last_name}</ListGroup.Item>
                        <ListGroup.Item>Age: {calculateAge(new Date(detailAppt.dob))}</ListGroup.Item>
                        <ListGroup.Item>Country: {detailAppt.country}</ListGroup.Item>
                        <ListGroup.Item>Appointment date: {moment(detailAppt.date).format("YYYY-MM-DD")}</ListGroup.Item>
                    </ListGroup>
                </Card>
            </>
        )
    }

    renderDocInformation = () => {
        return (
            <>
                <H5>{TABS.PERSONAL_INFO.text}</H5>
                    {USER_PROPERTIES.map((property, index) => {
                        if (this.state[property.value]) {
                            return (
                                <Form.Group controlId={"property " + index} id={"property " + index}>
                                    <Form.Label>{property.text}</Form.Label>
                                    <Form.Control placeholder="Fetching Details" value={this.state[property.value]} readOnly />
                                </Form.Group>
                            )
                        }
                        return null;
                    })}
            </>
        )
    }

	render() {
		const { loading } = this.state;
        return loading ? <Loading /> : 
        <div>
            <NavbarGroup align={Alignment.RIGHT} >
                <NavbarHeading align={Alignment.LEFT}>Doctor Profile</NavbarHeading>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} icon="person" text={TABS.PERSONAL_INFO.text} onClick={() => this.setState({ activePage: TABS.PERSONAL_INFO.value })} />
                <Button className={Classes.MINIMAL} icon="calendar"text={TABS.ALL_APPOINTMENTS.text} onClick={() => this.setState({ activePage: TABS.ALL_APPOINTMENTS.value })}  />
                <Button className={Classes.MINIMAL} icon="helper-management" text={TABS.CURRENT_APPOINTMENT.text} onClick={() => {
                    const { appointments } = this.state;
                    var todayAppt;
                    
                    appointments.map(( appt ) => {
                        todayAppt = appt;
                    });
                    
                    if (todayAppt) {
                        this.fetchApptSymptoms(todayAppt.appt_id);
                        this.fetchApptDiagnosis(todayAppt.appt_id);
                        this.fetchApptTests(todayAppt.appt_id);
                        this.fetchApptPrescription(todayAppt.appt_id);
                        this.fetchsymptomsNotSelected(todayAppt.appt_id);
                        this.fetchTestsNotSelected(todayAppt.appt_id);
                        this.fetchDiseasesNotDiagnosed(todayAppt.appt_id);
                        this.fetchMedicinesNotPrescribed(todayAppt.appt_id);
                        this.setState({ activePage: TABS.CURRENT_APPOINTMENT.value});
                    } else {
                        window.alert("No appointments today!");
                    }
                    }}  />
                <Button className={Classes.MINIMAL} icon="log-out"text={"Logout"} onClick={() => {
                        localStorage.removeItem("user");
                        this.props.history.push("/login");
                    }}/>
            </NavbarGroup>
            <Jumbotron style={{"background-color":"#FFFFFF"}}>
				<H3>Welcome Doctor</H3>
                <Row>
                    <Col xs={12} md={8}>
                        {this.renderView()}
                    </Col>
                    <Col xs={6} md={4}>
                        <H5>Calendar</H5>
                        <Calendar
                            key={this.state.datesUnavailable.length + this.state.appointments.length}
                            onClickDay={this.makeDayOff}
                            tileDisabled={({date }) => this.hasAppt(date)}
                            tileClassName={({ activeStartDate, date, view }) => view === 'month' && this.isUnavailalbe(date) ? 'off-day' : null}
                        />
                    </Col>
                </Row>
			</Jumbotron>
        </div>
		;
	}
}

export default Doctor;
