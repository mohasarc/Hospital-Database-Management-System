import React, { PureComponent } from "react";
import styled from "styled-components";
import { Button, FormGroup, InputGroup, Card, RadioGroup, Radio } from "@blueprintjs/core";
import axios from 'axios';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userType: '',
            loading: false
        };
    }

    render() {
        const { email, password, userType, loading } = this.state;
        return (
            <>
                {loading ? <Loading color={"grey"} width="10%" height="10%" type="spin" /> :
                    <Container>
                        <Card>
                            <h3 className="bp3-heading">Login</h3>
                            <FormGroup label="Email" labelFor="email" labelInfo="(required)">
                                <InputGroup id="email" placeholder="Email" type="text" onChange={e => this.setState({ email: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Password" labelFor="password" labelInfo="(required)">
                                <InputGroup id="password" placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
                            </FormGroup>
                            <RadioGroup label="User Type" onChange={(e) => this.setState({ userType: e.target.value })} selectedValue={userType} inline={true}>
                                <Radio label="Doctor" value="doctor" />
                                <Radio label="Patient" value="patient" />
                                <Radio label="Lab Technician" value="lab_technician" />
                                <Radio label="Pharmacist" value="pharmacist" />
                                <Radio label="Management" value="manager" />
                            </RadioGroup>
                            <ButtonContainer>
                                <Button text="Login" disabled={!email || !password || !userType} rightIcon="log-in" intent="success" onClick={this.loginUser} />
                                <Link to="/signup">Register Now</Link>
                            </ButtonContainer>
                        </Card>
                    </Container>}
            </>
        );
    }

    loginUser = async () => {
        const { history } = this.props;
        const { email, password, userType } = this.state;
        const user = { e_mail: email, password, type: userType };
        this.setState({ loading: true }, () => {
            axios.post(`http://localhost:8000/auth/login`, { ...user })
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    let route = "";
                    switch (userType) {
                        case "doctor":
                            route = "doctor";
                            break;
                        case "patient":
                            route = "patient";
                            break;
                        case "lab_technician":
                            route = "lt";
                            break;
                        case "pharmacist":
                            route = "pharmacist";
                            break;
                        case "manager":
                            route = "management";
                            break;
                    }
                    history.push("/" + route);
                })
                .catch((error) => {
                    toast(error.message, { style: { backgroundColor: "red", color: "white" } })
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        })

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
    width: 100%;
    text-align: center;
    a {
        display: block;
    }
`;

export default Login;
