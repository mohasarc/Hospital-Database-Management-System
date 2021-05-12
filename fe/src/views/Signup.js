import React, { PureComponent } from "react";
import styled from "styled-components";
import { Button, FormGroup, InputGroup, Card, RadioGroup, Radio, Divider } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import moment from 'moment';

class Signup extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (<Container>{this.state.proceedToNextStep ? this.renderUserSpecificPannel() : this.renderInitialPannel()}</Container>);
	}

    renderInitialPannel = () => {
        return (
            <Card>
                <h3 className="bp3-heading">Signup</h3>
                <Divider />
                <h6 className="bp6-heading">Personal Info</h6>
                <div className="row">
                    <FormGroup label="First Name" labelFor="firstName" className="col-4">
                        <InputGroup id="firstName" placeholder="First Name" type="text"  onChange={e => this.setState({ firstName: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Middle Name" labelFor="middleName" className="col-4">
                        <InputGroup id="middleName" placeholder="Middle Name" type="text"  onChange={e => this.setState({ middleName: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Last Name" labelFor="lastName" className="col-4">
                        <InputGroup id="lastName" placeholder="Last Name" type="text"  onChange={e => this.setState({ lastName: e.target.value })}/>
                    </FormGroup>
                </div>
                <div className="row">
                    <FormGroup label="Birth Date" labelFor="dob" className="col-4">
                        <DateInput formatDate={date => moment(date).format("YYYY-MM-DD")} onChange={(date) => this.setState({ dob: moment(date).format("YYYY-MM-DD") })} parseDate={str => new Date(str)} placeholder={"YYYY-MM-DD"} value={this.state.date} maxDate={new Date()} />
                    </FormGroup>
                    <FormGroup label="Country Code" labelFor="countryCode" className="col-4">
                        <InputGroup id="countryCode" placeholder="Country Code" type="text"  onChange={e => this.setState({ countryCode: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Phone Number" labelFor="phoneNumber" className="col-4">
                        <InputGroup id="phoneNumber" placeholder="Phone Number" type="text"  onChange={e => this.setState({ phoneNumber: e.target.value })}/>
                    </FormGroup>
                </div>
                <RadioGroup label="Gender" onChange={(e) => this.setState({ gender: e.target.value })} selectedValue={this.state.gender} inline={true}>
                    <Radio label="Male" value="male" />
                    <Radio label="Female" value="female" />
                    <Radio label="Other" value="other" />
                </RadioGroup>

                <Divider />
                <h6 className="bp6-heading">Address</h6>
                <div className="row">
                    <div className="col-3">
                        <FormGroup label="Apartment No." labelFor="apartmentNo">
                            <InputGroup id="apartmentNo" placeholder="Apartment Number" type="text"  onChange={e => this.setState({ apartmentNo: e.target.value })}/>
                        </FormGroup>
                    </div>
                    <div className="col-3">
                        <FormGroup label="Street No." labelFor="streetNo">
                            <InputGroup id="streetNo" placeholder="Street Number" type="text"  onChange={e => this.setState({ streetNo: e.target.value })}/>
                        </FormGroup>
                    </div>
                    <div className="col-6">
                        <FormGroup label="Street Name" labelFor="streetName">
                            <InputGroup id="streetName" placeholder="Street Name" type="text"  onChange={e => this.setState({ streetName: e.target.value })}/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <FormGroup label="Zip" labelFor="zip" className="col-3">
                        <InputGroup id="zip" placeholder="Zip" type="text" onChange={e => this.setState({ zip: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="City" labelFor="city" className="col-3">
                        <InputGroup id="city" placeholder="City" type="text" onChange={e => this.setState({ city: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="State" labelFor="state" className="col-3">
                        <InputGroup id="state" placeholder="State" type="text" onChange={e => this.setState({ state: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Country" labelFor="country" className="col-3">
                        <InputGroup id="country" placeholder="Country" type="text" onChange={e => this.setState({ country: e.target.value })} />
                    </FormGroup>
                </div>

                <Divider />
                <h6 className="bp6-heading">Email & Password</h6>
                <FormGroup label="Email" labelFor="email">
                    <InputGroup id="email" placeholder="Email" type="text"  onChange={e => this.setState({ email: e.target.value })}/>
                </FormGroup>
                <div className="row">
                    <FormGroup label="Password" labelFor="password" className="col-6">
                        <InputGroup id="password" placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Current Password" labelFor="currentPassword" className="col-6">
                        <InputGroup id="currentPassword" placeholder="Current Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                </div>
                <RadioGroup label="User Type" onChange={(e) => this.setState({ userType: e.target.value })} selectedValue={this.state.userType} inline={true}>
                    <Radio label="Doctor" value="doctor" />
                    <Radio label="Patient" value="patient" />
                    <Radio label="Lab Technician" value="lab_technician" />
                    <Radio label="Pharmacist" value="pharmacist" />
                </RadioGroup>
                <ButtonContainer>
                    <Button text="Proceed" rightIcon="arrow-right" intent="success" onClick={() => this.setState({ proceedToNextStep: true })}/>
                </ButtonContainer>
            </Card>    
        );
    }

    renderUserSpecificPannel = () => {
        const { userType } = this.state;
        let tabContent = null;
        switch(userType) {
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
            case "patient":
                tabContent = (
                    <>
                        <FormGroup label="Height" labelFor="height">
                            <InputGroup id="height" placeholder="Height" type="text"  onChange={e => this.setState({ height: e.target.value })}/>
                        </FormGroup>
                        <FormGroup label="Weight" labelFor="weight">
                            <InputGroup id="weight" placeholder="Weight" type="text"  onChange={e => this.setState({ weight: e.target.value })}/>
                        </FormGroup>
                        <FormGroup label="Blood Group" labelFor="bloodGroup">
                            <InputGroup id="bloodGroup" placeholder="Blood Group" type="text"  onChange={e => this.setState({ bloodGroup: e.target.value })}/>
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
        return (
            <Card>
                <h3 className="bp3-heading">Almost there...</h3>
                <Divider />
                {tabContent}
                <ButtonContainer>
                    <Button text="Go Back" rightIcon="double-chevron-left" intent="danger" onClick={() => this.setState({ proceedToNextStep: false })}/>
                    <Button text="Register" rightIcon="arrow-right" intent="success" onClick={() => {}}/>
                </ButtonContainer>
            </Card>
        );
    }
}

const Container = styled.div`
    width: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 60%;
`;

export default Signup;
