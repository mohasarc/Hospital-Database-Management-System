import React, { PureComponent } from "react";
import styled from "styled-components";
import { Button, FormGroup, InputGroup, Card, RadioGroup, Radio, Divider, Checkbox } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import moment from 'moment';
import Loading from './Loading';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class Signup extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            proceedToNextStep: false
        };
	}

	render() {
        const { proceedToNextStep, loading } = this.state;
		return (
            <>
                {loading ? <Loading /> :
                <Container>
                    {proceedToNextStep ? this.renderUserSpecificPannel() : this.renderInitialPannel()}
                </Container>}
            </>
        );
	}

    renderInitialPannel = () => {
        const { email, firstName, lastName, password, confirmPassword } = this.state;
        return (
            <Card>
                <h3 className="bp3-heading">Signup</h3>
                <Divider />
                <h6 className="bp6-heading">Personal Info</h6>
                <div className="row">
                    <FormGroup label="First Name" labelFor="firstName" labelInfo="(required)" className="col-4">
                        <InputGroup id="firstName" placeholder="First Name" type="text"  onChange={e => this.setState({ firstName: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Middle Name" labelFor="middleName" className="col-4">
                        <InputGroup id="middleName" placeholder="Middle Name" type="text"  onChange={e => this.setState({ middleName: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Last Name" labelFor="lastName" labelInfo="(required)" className="col-4">
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
                <FormGroup label="Email" labelFor="email" labelInfo="(required)">
                    <InputGroup id="email" placeholder="Email" type="text"  onChange={e => this.setState({ email: e.target.value })}/>
                </FormGroup>
                <div className="row">
                    <FormGroup label="Password" labelFor="password" className="col-6" labelInfo="(required)">
                        <InputGroup id="password" placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Confirm Password" labelFor="confirmPassword" className="col-6" labelInfo="(required)">
                        <InputGroup id="confirmPassword" placeholder="Confirm Password" type="password" onChange={e => this.setState({ confirmPassword: e.target.value })} />
                    </FormGroup>
                </div>
                <Checkbox label="Register as Patient" onChange={() => this.setState({ registerAsPatient: !this.state.registerAsPatient })}/>
                {this.state.registerAsPatient &&
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
                    </>}
                <ButtonContainer>
                    <Button
                        text="Proceed"
                        rightIcon="arrow-right"
                        intent="success"
                        onClick={this.register}
                        disabled={this.resolveButtonDisabledStatus()}
                    />
                    <Link to="/login">Already a member?</Link>
                </ButtonContainer>
            </Card>    
        );
    }

    register = () => {
        const { history } = this.props;
        const { firstName, middleName, lastName, dob, apartmentNo, streetName, streetNo, city, state, zip, country, countryCode, phoneNumber, gender, email,password,height,weight,bloodGroup  } = this.state;
        let objToSend = { first_name:firstName , middle_name: middleName,  last_name: lastName,  dob: dob,  apt_num: apartmentNo,  street_name: streetName, street_num: streetNo,  city: city,  state: state,  zip: zip,  country: country,  country_code: countryCode,  number: phoneNumber,  gender: gender,  e_mail: email,  password: password };
        if (this.state.registerAsPatient) {
            objToSend = { ...objToSend, height, weight, blood_group: bloodGroup, type: "PATIENT" }
        }
        this.setState({ loading: true }, () => {
            axios.post(`http://localhost:8000/auth/signup`, { ...objToSend })
            .then((res) => {
                toast("Successfully signed up.", { style:{ backgroundColor: "green", color: "white"} })
                history.push("/login");
            })
            .catch(error => {
                toast(error.message, { style:{ backgroundColor: "red", color: "white"} })
            })
            .finally(() => {
                this.setState({ loading: false });
            });
        })
    }

    resolveButtonDisabledStatus = () => {
        const { registerAsPatient, weight, height, bloodGroup, email, password, confirmPassword, firstName, lastName } = this.state;
        const isBasicValid = email && password && confirmPassword && (password === confirmPassword) && firstName && lastName;
        if (registerAsPatient) {
            return !(isBasicValid && weight && height && bloodGroup);
        } 
        return !isBasicValid;
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
    text-align: center;
    a {
        display: block;
    }
`;

export default Signup;
