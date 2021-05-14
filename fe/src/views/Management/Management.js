import { Button, Divider, FormGroup, H3, H5, InputGroup } from "@blueprintjs/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from "axios";
import React, { PureComponent } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Loading from "../Loading";

class Management extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            doctors: [],
            labTechnicians: [],
            pharmacists: [],
            unresolvedEmployes: [],
        };

	}

	componentDidMount() {
        this.fetchAllEmployees();
	}

    fetchAllEmployees = () => {
        this.setState({ loading: true }, async () => {
            const unresolvedEmployes = await axios.get("http://localhost:8000/person/not_identified");
			const doctors = await axios.get("http://localhost:8000/management/employee/doctor");
			const labTechnicians = await axios.get("http://localhost:8000/management/employee/lt");
			const pharmacists = await axios.get("http://localhost:8000/management/employee/pharmacist");
			this.setState({ loading: false, doctors: doctors.data, labTechnicians: labTechnicians.data, pharmacists: pharmacists.data, unresolvedEmployes: unresolvedEmployes.data });
		});
    }

	render() {
		const { loading } = this.state;
        return loading ? <Loading /> : <div>
				<H3>Welcome to the Management Page</H3>

                <H5>Unresolved Employees</H5>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Surname</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Phone Number</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.unresolvedEmployes.map((row) => (
                            <TableRow key={"unresolved" + row.person_id}>
                            <TableCell component="th" scope="row">{row.person_id}</TableCell>
                            <TableCell align="left">{row.first_name}</TableCell>
                            <TableCell align="left">{row.last_name}</TableCell>
                            <TableCell align="left">{row.e_mail}</TableCell>
                            <TableCell align="left">{row.country_code && row.number ? row.country_code + " " + row.number : ""}</TableCell>
                            <TableCell align="left">
                                <DropdownButton title="Add" id="dropdown-menu-align-right" onSelect={val => this.setState({ eventKey: val, selectedUnresolvedEmployee: row.person_id })}>
                                    <Dropdown.Item eventKey="doctor">Doctor</Dropdown.Item>
                                    <Dropdown.Item eventKey="pharmacist">Pharmacist</Dropdown.Item>
                                    <Dropdown.Item eventKey="lab_technician">Lab Technician</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="none">Cancel</Dropdown.Item>
                                </DropdownButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {this.renderForm()}
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
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.doctors.map((row) => (
                            <TableRow key={"doctors" + row.person_id}>
                                <TableCell component="th" scope="row">{row.person_id}</TableCell>
                                <TableCell align="left">{row.first_name}</TableCell>
                                <TableCell align="left">{row.last_name}</TableCell>
                                <TableCell align="left">{row.dept_name}</TableCell>
                                <TableCell align="left">{row.specialization}</TableCell>
                                <TableCell align="left">{row.qualification}</TableCell>
                                <TableCell align="left">
                                    <Button text="Delete" intent="danger" onClick={() => this.setState({ selectedEmployee: row.person_id, selectedType: "doctor"  }, () => this.deleteUser())}></Button>
                                </TableCell>
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
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.pharmacists.map((row) => (
                            <TableRow key={"pharma" + row.person_id}>
                                <TableCell component="th" scope="row">{row.person_id}</TableCell>
                                <TableCell align="left">{row.first_name}</TableCell>
                                <TableCell align="left">{row.last_name}</TableCell>
                                <TableCell align="left">{row.qualifications}</TableCell>
                                <TableCell align="left">
                                    <Button text="Delete" intent="danger" onClick={() => this.setState({ selectedEmployee: row.person_id, selectedType: "pharmacist" }, () => this.deleteUser())}></Button>
                                </TableCell>
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
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.labTechnicians.map((row) => (
                            <TableRow key={"lt" + row.person_id}>
                                <TableCell component="th" scope="row">{row.person_id}</TableCell>
                                <TableCell align="left">{row.first_name}</TableCell>
                                <TableCell align="left">{row.last_name}</TableCell>
                                <TableCell align="left">{row.expertise}</TableCell>
                                <TableCell align="left">
                                    <Button text="Delete" intent="danger" onClick={() => this.setState({ selectedEmployee: row.person_id, selectedType: "lt" }, () => this.deleteUser())}></Button>
                                </TableCell>
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
            default: 
                return null;
        }
        return (tabContent &&
            <div>
                {tabContent}
                <Button text="Insert" onClick={this.registerUser} disabled={this.resolveButtonDisabledStatus()}></Button>
            </div>
        );
    }

    registerUser = () => {
        const { eventKey, selectedUnresolvedEmployee, deptName, specialization, qualifications, expertise } = this.state;
        this.setState({ loading: true }, () => {
            let endpoint = "";
            let objectToSend = {};
            switch(eventKey) {
                case "doctor":
                    endpoint = "doctor";
                    objectToSend = { d_id: selectedUnresolvedEmployee, dept_name: deptName, specialization, qualification: qualifications }
                    break;
                case "pharmacist":
                    endpoint = "pharmacist";
                    objectToSend = { ph_id: selectedUnresolvedEmployee, qualifications }; 
                    break;
                case "lab_technician":
                    endpoint = "lt";
                    objectToSend = { lt_id: selectedUnresolvedEmployee, expertise };
                    break;
                default: 
                    break;
            }
            axios.post(`http://localhost:8000/management/employee/${endpoint}`, { ...objectToSend }).then((res) => {
                this.fetchAllEmployees();
            }).finally(() => {
                this.setState({ loading: false });
            });

        });
    }

    resolveButtonDisabledStatus = () => {
        const { eventKey, deptName, specialization, qualifications, expertise } = this.state;
        
        switch (eventKey) {
            case "doctor":
                return !deptName || !specialization || !qualifications;
            case "lab_technician":
                return !expertise;
            case "pharmacist":
                return !qualifications;
            default:
                return false;
        }   
    }

    deleteUser = () => {
        this.setState({ loading: true }, () => {
            const URL = `http://localhost:8000/management/employee/${this.state.selectedType}`;
            let idFieldName = "";
            switch(this.state.selectedType) {
                case "doctor":
                    idFieldName = "d_id";
                    break;
                case "pharmacist":
                    idFieldName = "ph_id";
                    break;
                case "lt":
                    idFieldName = "lt_id";
                    break;
                default: 
                    break;
            }
            axios.delete(URL, {
                headers: {},
                data: {
                  [idFieldName]: this.state.selectedEmployee
                }
              }).then(res => {
                  this.fetchAllEmployees();
              }).finally(() => {
                  this.setState({ loading: false })
              });
        })
    }
}

export default Management;
