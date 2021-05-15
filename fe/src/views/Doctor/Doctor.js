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
import { Jumbotron, Row, Col } from 'react-bootstrap';
import Loading from "../Loading";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
import { Button } from "@material-ui/core";

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

class Doctor extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            appointments: [],
            datesUnavailable: [],
            docName: "",
            deptName: undefined,
            ...JSON.parse(localStorage.getItem("user")),
        };
	}

	componentDidMount() {
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

    viewApptDetails = async (apptInfo) => {

    }

	render() {
		const { loading } = this.state;
        return loading ? <Loading /> : <Jumbotron>
				<H3>Welcome Doctor</H3>
                <Row>
                    <Col xs={12} md={8}>
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
                                        <TableCell component="th" scope="row">{moment(row.data).format("YYYY-MM-DD")}</TableCell>
                                        <TableCell component="th" scope="row">{row.first_name + ' ' + row.middle_name + ' ' + row.last_name}</TableCell>
                                        <TableCell component="th" scope="row">{calculateAge(new Date(row.dob))}</TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button onClick={() => {this.cancelAppt(row)}}>cancel</Button>
                                            <Button onClick={() => {this.viewApptDetails(row)}} >details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                    <Col xs={6} md={4}>
                        <H5>Calendar</H5>
                        <Calendar
                            key={this.state.datesUnavailable.length}
                            onClickDay={this.makeDayOff}
                            // tileDisabled={({activeStartDate, date, view }) => this.isUnavailalbe(date)}
                            tileClassName={({ activeStartDate, date, view }) => view === 'month' && this.isUnavailalbe(date) ? 'off-day' : null}
                        />
                    </Col>
                </Row>
			</Jumbotron>
		;
	}
}

export default Doctor;
