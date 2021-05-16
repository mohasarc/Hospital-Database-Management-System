import React, { PureComponent } from "react";
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { Alignment, Button, Classes, Divider, H5, H6, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, FormGroup, InputGroup } from "@blueprintjs/core";
import { ToastContainer, toast } from 'react-toastify';

class Tests extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            tests: [],
            components: [],
            componentDetails: [],
        };
	}

    componentDidMount() {
        this.getAllTestsForPatient();
    }

	render() {
        const { tests, components, componentDetails } = this.state;
        console.log(this.state.componentDetails);
		return (
            <div>
                <div>
                    <H5>All Tests</H5>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {tests.map((row) => (
                                <TableRow key={"test" + row.t_id + row.p_id + row.appt_id}>
                                    <TableCell component="th" scope="row">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.status}</TableCell>
                                    <TableCell align="left">
                                        <Button text="Info" intent="primary" disabled={false} onClick={() => this.getTestComponentDetails(row.appt_id, row.t_id)}></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {components.length > 0 &&
                <div>
                    <H5>General Test View</H5>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Component Name</TableCell>
                                <TableCell align="left">Range</TableCell>
                                <TableCell align="left">Score</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {components.map((row) => (
                                <TableRow key={"component" + row.c_id + row.appt_id + row.t_id}>
                                    <TableCell align="left">{row.c_name}</TableCell>
                                    <TableCell align="left">{row.min_interval + " - " + row.max_interval}</TableCell>
                                    <TableCell align="left">{row.score}</TableCell>
                                    <TableCell align="left">
                                        <Button text="Info" intent="primary" disabled={false} onClick={() => this.getComponentPastHistory(row)}></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>}
                {componentDetails.length > 0 &&
                <div>
                    <H5>Detailed Component View</H5>
                    {this.state.selectedComponentName && <H6>{this.state.selectedComponentName}</H6>}
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Score</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {componentDetails.map((row) => (
                                <TableRow key={"component" + row.c_id + row.appt_id + row.t_id}>
                                    <TableCell align="left">{moment(row.date).format("YYYY-DD-MM")}</TableCell>
                                    <TableCell align="left">{row.score}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>}
                <ToastContainer 
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    // draggable
                    // pauseOnHover
                />
            </div>

		);
	}

    getAllTestsForPatient = () => {
        const patient = JSON.parse(localStorage.getItem("user"));
        this.setState({ loading: true }, () => {
            axios.get(`http://localhost:8000/patient/test/${patient.pid}`).then((res) => {
                this.setState({ tests: res.data });
            })
            .catch(error => {
                toast("Could not get tests.", { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false });
            });
        })
    }

    getTestComponentDetails = (appt_id, t_id) => {
        this.setState({ loading: true }, () => {
            axios.get(`http://localhost:8000/appointment/test/comps/${appt_id}/${t_id}`)
            .then((res) => {
                this.setState({ components: res.data });
            })
            .catch(error => {
                toast("Could not get components.", { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false });
            });
        })
    }

    getComponentPastHistory = (component) => {
        const patient = JSON.parse(localStorage.getItem("user"));
        const p_id = patient.pid;
        const { appt_id, c_id, t_id } = component;
        this.setState({ loading: true }, () => {
            axios.get(`http://localhost:8000/appointment/tests/patient/comps/${appt_id}/${p_id}/${t_id}/${c_id}`)
            .then((res) => {
                this.setState({ componentDetails: res.data, selectedComponentName: component.c_name });
                if (res.data && res.data.length == 0) {
                    toast("No history available for this component.", { style:{ backgroundColor: "red", color: "white"} })
                }
            })
            .catch(error => {
                toast(error.message, { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false });
            });
        })
    }
}

export default Tests;
