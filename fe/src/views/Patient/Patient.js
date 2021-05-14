import React, { PureComponent } from "react";
import styled from 'styled-components';
import { Alignment, Button, Classes, Divider, H5, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Switch } from "@blueprintjs/core";
import { Form } from 'react-bootstrap';
import { USER_PROPERTIES } from './UserProperties';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

const TABS = {
    PersonalInfo: { value: "PERSONAL_INFORMATION", text: "Personal Information" },
    Appointments: { value: "APPOINTMENTS", text: "Appointments" }
}

class Patient extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            activePage: TABS.Appointments.value,
            appointments: [],
            ...JSON.parse(localStorage.getItem("user")),
        };
	}

    componentDidMount() {
        this.getAllAppointmentsForPatient();
    }

	render() {
        // console.log(this.state);
        return (
            <div>
                <NavbarGroup align={Alignment.RIGHT} >
                    <NavbarHeading align={Alignment.LEFT}>Patient Profile</NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="person" text={TABS.PersonalInfo.text} onClick={() => this.setState({ activePage: TABS.PersonalInfo.value })} />
                    <Button className={Classes.MINIMAL} icon="calendar"text={TABS.Appointments.text} onClick={() => this.setState({ activePage: TABS.Appointments.value })}  />
                </NavbarGroup>
                <Body>
                    {this.renderView()}
                </Body>
            </div>

		);
	}

    renderView = () => {
        const { activePage } = this.state;
        switch(activePage) {
            case TABS.PersonalInfo.value:
                return (
                    <>
                        <H5>{TABS.PersonalInfo.text}</H5>
                        <PropertiesContainer>
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
                        </PropertiesContainer>
                    </>
                );
                break;
            case TABS.Appointments.value:
                return (
                    <>
                        <H5>{TABS.Appointments.text}</H5>
                        <Button intent="success" text="Book Appointment" onClick={this.bookAppointment}/>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">Date</TableCell>
                                    <TableCell align="left">Doctor Name</TableCell>
                                    <TableCell align="left">Description</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">Actions</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.appointments.map((row) => (
                                    <TableRow key={"appointment" + row.appt_id}>
                                        <TableCell component="th" scope="row">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
                                        <TableCell align="left">{`${row.first_name} ${row.middle_name || ""} ${row.last_name}`}</TableCell>
                                        <TableCell align="left">{row.description}</TableCell>
                                        <TableCell align="left">{row.status}</TableCell>
                                        <TableCell align="left">
                                            <Button text="Cancel" intent="danger" onClick={() => this.cancelAppointment(row.appt_id)}></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                );                
        }
    }

    getAllAppointmentsForPatient = () => {
        this.setState({ loading: true }, () => {
            axios.get(`http://localhost:8000/appointment/${this.state.pid}`).then((res) => {
                this.setState({ appointments: res.data });
            }).finally(() => {
                this.setState({ loading: false });
            });
        })
    }

    bookAppointment = () => {
        const { pid } = this.state;
        const objToSend = {
            p_id: pid, 
            d_id: "d8d60d7b-8256-417f-b3d8-769ed2d47939", 
            description: "Yo dawg i am sick"
        }
        this.setState({ loading: true }, () => {
            axios.post(`http://localhost:8000/appointment`, { ...objToSend }).then((res) => {
                // localStorage.setItem("user", JSON.stringify(res.data));
                // history.push("/management");?
            }).finally(() => {
                this.setState({ loading: false });
            });
        })
    }

    cancelAppointment = (appt_id) => {
        axios.patch(`http://localhost:8000/appointment`, { appt_id }).then(res => {
            this.getAllAppointmentsForPatient();
        })
    }
}


const Body = styled.div`
    position: absolute;
    top: 45px;
    left: 10px;
    width: 100%;
    border-top: 1px solid grey;
`;

const PropertiesContainer = styled.div`
    width: 30%;
`;
export default Patient;
