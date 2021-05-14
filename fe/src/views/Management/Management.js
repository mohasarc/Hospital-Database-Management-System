import { H3, H5 } from "@blueprintjs/core";
import axios from "axios";
import React, { PureComponent } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Button, FormGroup, InputGroup, Card, RadioGroup, Radio, Divider } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import moment from 'moment';
import styled from 'styled-components';
import Loading from "../Loading";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Management extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            doctors: [],
            labTechnicians: [],
            pharmacists: [],
        };
	}

	componentDidMount() {
		this.setState({ loading: true }, async () => {
			const doctors = await axios.get("http://localhost:8000/management/employee/doctor");
			const labTechnicians = await axios.get("http://localhost:8000/management/employee/lt");
			const pharmacists = await axios.get("http://localhost:8000/management/employee/pharmacist");
			this.setState({ loading: false, doctors: doctors.data, labTechnicians: labTechnicians.data, pharmacists: pharmacists.data });
		});
	}

	render() {
		const { loading } = this.state;

        return loading ? <Loading /> : <div>
				<H3>Welcome to the Management Page</H3>
                <EmployeeContainer>
                    <DropdownButton title="Add Employee" id="dropdown-menu-align-right" onSelect={val => this.setState({ eventKey: val })}>
                        <Dropdown.Item eventKey="doctor">Doctor</Dropdown.Item>
                        <Dropdown.Item eventKey="pharmacist">Pharmacist</Dropdown.Item>
                        <Dropdown.Item eventKey="lab_technician">Lab Technician</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="none">Cancel</Dropdown.Item>
                    </DropdownButton>
                </EmployeeContainer>

                <H5>Doctors</H5>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Surname</TableCell>
                            <TableCell align="left">Department Name</TableCell>
                            <TableCell align="left">Specialization</TableCell>
                            <TableCell align="left">Expertise</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.doctors.map((row) => (
                            <TableRow key={row.id}>
                            <TableCell component="th" scope="row">{row.person_id}</TableCell>
                            <TableCell align="left">{row.first_name}</TableCell>
                            <TableCell align="left">{row.last_name}</TableCell>
                            <TableCell align="left">{row.dept_name}</TableCell>
                            <TableCell align="left">{row.specialization}</TableCell>
                            <TableCell align="left">{row.qualification}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <H5>Pharmacists</H5>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Surname</TableCell>
                            <TableCell align="left">Qualifications</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.pharmacists.map((row) => (
                            <TableRow key={row.person_id}>
                                <TableCell component="th" scope="row">{row.person_id}</TableCell>
                                <TableCell align="left">{row.first_name}</TableCell>
                                <TableCell align="left">{row.last_name}</TableCell>
                                <TableCell align="left">{row.qualifications}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                <Divider />

                <H5>Lab Technicians</H5>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Surname</TableCell>
                            <TableCell align="left">Expertise</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.labTechnicians.map((row) => (
                            <TableRow key={row.person_id}>
                                <TableCell component="th" scope="row">{row.person_id}</TableCell>
                                <TableCell align="left">{row.first_name}</TableCell>
                                <TableCell align="left">{row.last_name}</TableCell>
                                <TableCell align="left">{row.expertise}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider />
			</div>
		;
	}

    renderForm = () => {
        const { eventKey } = this.state;
        let tabContent = null;
        switch (eventKey) {
            case "doctor":
                tabContent = (
                    <>
                        <FormGroup label="Department Name" labelFor="deptName">
                            <InputGroup id="deptName" placeholder="Department Name" type="text"  onChange={e => this.setState({ deptName: e.target.value })}/>
                        </FormGroup>
                        <FormGroup label="Specialization" labelFor="specialization">
                            <InputGroup id="specialization" placeholder="Specialization" type="text"  onChange={e => this.setState({ specialization: e.target.value })}/>
                        </FormGroup>
                        <FormGroup label="Qualifications" labelFor="qualifications">
                            <InputGroup id="qualifications" placeholder="Qualifications" type="text"  onChange={e => this.setState({ qualifications: e.target.value })}/>
                        </FormGroup>
                    </>
                );
                break;
            case "lab_technician":
                tabContent = (
                    <>
                        <FormGroup label="Expertise" labelFor="expertise">
                            <InputGroup id="expertise" placeholder="Expertise" type="text"  onChange={e => this.setState({ expertise: e.target.value })}/>
                        </FormGroup>
                    </>

                );
                break;
            case "pharmacist":
                tabContent = (
                    <>
                        <FormGroup label="Qualifications" labelFor="qualifications">
                            <InputGroup id="qualifications" placeholder="Qualifications" type="text"  onChange={e => this.setState({ qualifications: e.target.value })}/>
                        </FormGroup>
                    </>
                );  
                break;
        }
        return tabContent;
    }

    registerUser = () => {
        this.setState({ loading: true }, async () => {
            const res = await axios.post(`http://localhost:8000/management/employee/doctor`, { ...this.state });
                // localStorage.setItem("user", JSON.stringify(res.data));
                // history.push("/management");
            // }).finally(() => {
            console.log(res);
            this.setState({ loading: false });
            // });
        })
    }
}


const EmployeeContainer = styled.div`

`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 60%;
`;

const FormsContainer = styled(Card)`
    width: 60%;
`;
export default Management;
