import { Alignment, Button, Classes, Divider, FormGroup, H3, H5, H6, InputGroup, NavbarDivider, NavbarGroup, NavbarHeading, } from "@blueprintjs/core";
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
import { ToastContainer, toast } from 'react-toastify';
import styled from "styled-components";
import Medicines from './Medicines';
import PharmacyList from './PharmacyList';
import Modal from 'react-modal';

class Management extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            doctors: [],
            labTechnicians: [],
            pharmacists: [],
            unresolvedEmployes: [],
            pharmacies: [],
            assignPharmacist: false,
            pharmacistsAtPharmacies: [],
        };

	}

	componentDidMount() {
        this.fetchAllEmployees();
        this.fetchPharmacies();
        this.fetchPharmacistsAtPharmacies();
	}

    fetchPharmacistsAtPharmacies = () => {
        this.setState({ loading: true }, () => {
            axios.get("http://localhost:8000/management/employee/pharmacist/pharmaciesAndPharmacists")
            .then(({ data }) => {
                console.log(data);
                this.setState({ pharmacistsAtPharmacies: data });
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            })
        })
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

    fetchPharmacies = async () => {
        const url = `http://localhost:8000/management/pharmacy`;
        this.setState({ loading: true });
        const phars = await (await axios.get(url)).data;
        this.setState({ pharmacies: phars, loading: false });
    }

	render() {
		const { loading } = this.state;
        return <> {loading ? <Loading /> : <div>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarHeading align={Alignment.LEFT}>Patient Profile</NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="log-out"text={"Logout"} onClick={() => {
                        localStorage.removeItem("user");
                        this.props.history.push("/login");
                    }}/>
                </NavbarGroup>
                <Container>
                <Divider />
				<H3 style={{ textAlign: 'center', marginBottom: '35px', marginTop: '25px' }}>Welcome to the Management Page</H3>

                <UnresolvedEmployeesContainer>
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
                </UnresolvedEmployeesContainer>
                <FormsContainer>
                    {this.renderForm()}
                </FormsContainer>

                <Divider />

                <DoctorsContainer>
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
                </DoctorsContainer>
                
                <Divider />
                <PharmacistsContainer>
                    <H5>All Pharmacists</H5>
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
                                    <TableCell align="left" style={{ display: 'flex' }}>
                                        <Button text="Delete" intent="danger" onClick={() => this.setState({ selectedEmployee: row.person_id, selectedType: "pharmacist" }, () => this.deleteUser())}></Button>
                                        <Button text="Assign" intent="success" onClick={() => this.setState({ selectedEmployee: row.person_id, assignPharmacist: true })}></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </PharmacistsContainer>
                <Modal isOpen={this.state.assignPharmacist} contentLabel="Example Modal" ariaHideApp={false}>
                {this.state.assignPharmacist && <TableContainer>
                            <H6>Pharmacies</H6>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">ID</TableCell>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="left">Room No.</TableCell>
                                    <TableCell align="left">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            {this.state.pharmacies.map(pharmacy => {
                                return <TableRow key={"pharmacy" + pharmacy.phmcy_id}>
                                <TableCell component="th" scope="row">{pharmacy.phmcy_id}</TableCell>
                                <TableCell align="left">{pharmacy.name}</TableCell>
                                <TableCell align="left">{pharmacy.room_no}</TableCell>
                                <TableCell align="left" style={{ display: 'flex' }}>
                                    <Button text="Assign" intent="success" onClick={() => this.assignPharmacist(pharmacy.phmcy_id)}></Button>
                                </TableCell>
                            </TableRow>
                            })}                    
                        </Table>

                        </TableContainer>}
                    <Button text="Close" intent="danger" onClick={() => this.setState({ selectedEmployee: '', assignPharmacist: false })} />
                </Modal>

                <LTContainer>
                    <H5>All Lab Technicians</H5>
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
                </LTContainer>

                <Divider />
                {this.state.pharmacistsAtPharmacies.length !== 0 &&
                <AssignedPharmacistsContainer>
                    <H5 style={{ textAlign: 'center' }}>Assigned Pharmacists</H5>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Pharmacist ID</TableCell>
                                <TableCell align="left">Pharmacist Name</TableCell>
                                <TableCell align="left">Pharmacist Surname</TableCell>
                                <TableCell align="left">Qualifications</TableCell>
                                <TableCell align="left">Pharmacy Name</TableCell>
                                <TableCell align="left">Pharmacy Room No</TableCell>
                                <TableCell align="left">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.state.pharmacistsAtPharmacies.map((row) => (
                                <TableRow key={"lt" + row.ph_id}>
                                    <TableCell component="th" scope="row">{row.ph_id}</TableCell>
                                    <TableCell align="left">{row.first_name}</TableCell>
                                    <TableCell align="left">{row.last_name}</TableCell>
                                    <TableCell align="left">{row.qualifications}</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.room_no}</TableCell>
                                    <TableCell align="left">
                                        <Button text="Delete" intent="danger" onClick={() => this.unassignPharmacist(row.ph_id)}></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Divider />
                </AssignedPharmacistsContainer>}
                <div>
                    <PharmaciesContainer>
                        <H5 style={{ textAlign: 'center' }}>Pharmacies</H5>
                        <PharmacyList pharmacies={this.state.pharmacies} pharmacists={this.state.pharmacists} />        
                    </PharmaciesContainer>
                    <Divider />
                    <MedicinesContainer>
                        <Medicines />
                    </MedicinesContainer>
                </div>
                
            </Container>
        </div>}
		</>;
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
                tabContent = null;
        }
        return (tabContent ?
            <div>
                <H5>Details</H5>
                {tabContent}
                <Button text="Insert" onClick={this.registerUser} disabled={this.resolveButtonDisabledStatus()}></Button>
            </div> : <H5>Choose an action...</H5>
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
            axios.post(`http://localhost:8000/management/employee/${endpoint}`, { ...objectToSend })
            .then((res) => {
                this.fetchAllEmployees();
            })
            .catch(error => {
			    toast(error.message, { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
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

    assignPharmacist = (phmcy_id) => {
        const { selectedEmployee } = this.state;
        this.setState({ loading: true }, () => {
            axios.post(`http://localhost:8000/management/employee/pharmacist/assign`, { ph_id: selectedEmployee, phmcy_id })
            .then((res) => {
                this.fetchPharmacistsAtPharmacies();
                this.setState({ assignPharmacist: false });
                toast("Successfully assigned pharmacist.", { style:{ backgroundColor: "green", color: "white"} })
            })
            .catch(error => {
			    toast("Could not assign pharmacist.", { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false, });
            });
        })
        
        // console.log(phmcy_id);
        // console.log(selectedEmployee);
    }

    unassignPharmacist = (ph_id) => {
        this.setState({ loading: true }, () => {
            axios.post(`http://localhost:8000/management/employee/pharmacist/unassign`, { ph_id })
            .then(res => {
                this.fetchPharmacistsAtPharmacies();
                toast("Successfully unassigned pharmacist.", { style:{ backgroundColor: "green", color: "white"} })
            })
            .catch(err => {
			    toast("Could not unassign pharmacist.", { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false });
            })
        })
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
              }).catch((error) => {
                    toast(error.message, { style:{ backgroundColor: "red", color: "white"} })
              }).finally(() => {
                  this.setState({ loading: false })
              });
        })
    }
}

const Container = styled.div`
    position: absolute;
    top: 50px;
    width: 100%;
`;

const UnresolvedEmployeesContainer = styled.div`
    width: 70%;
    text-align: center;
    display: inline-block;
`;

const FormsContainer = styled.div`
    width: 30%;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    margin-top: 100px;
    padding: 15px
`;

const DoctorsContainer = styled.div`
    margin-top: 25px;
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    text-align: center;
`;
const PharmacistsContainer = styled.div`
    margin-top: 50px;
    width: 50%;
    display: inline-block;
    text-align: center;
    padding: 10px;
`;

const LTContainer = styled.div`
    margin-top: 50px;
    width: 50%;
    display: inline-block;
    text-align: center;
    padding: 10px;
`;

const PharmaciesContainer = styled.div`
    width: 80%;
    margin-top: 50px;
    padding: 15px;
    display: inline-block;
    position: relative;
    left: 10%;
`;

const MedicinesContainer = styled.div`
    width: 60%;
    position: absolute;
    left: 20%;
`;

const AssignedPharmacistsContainer = styled.div`
    padding: 30px;
`;

export default Management;
