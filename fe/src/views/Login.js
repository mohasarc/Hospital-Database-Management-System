import React, { PureComponent } from "react";
import styled from "styled-components";
import { Button, FormGroup, InputGroup, Card, RadioGroup, Radio } from "@blueprintjs/core";

class Login extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
            email: '',
            password: '',
            userType: '',

        };
	}

	render() {
        const { email, password, userType } = this.state;
		return (
			<Container>
                <Card>
                    <h3 className="bp3-heading">Login</h3>
                    <FormGroup label="Email" labelFor="email" labelInfo="(required)">
                        <InputGroup id="email" placeholder="Email" type="text"  onChange={e => this.setState({ email: e.target.value })}/>
                    </FormGroup>
                    <FormGroup label="Password" labelFor="password" labelInfo="(required)">
                        <InputGroup id="password" placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                    <RadioGroup label="User Type" onChange={(e) => this.setState({ userType: e.target.value })} selectedValue={userType} inline={true}>
                        <Radio label="Doctor" value="doctor" />
                        <Radio label="Patient" value="patient" />
                        <Radio label="Lab Technician" value="lab_technician" />
                        <Radio label="Pharmacist" value="pharmacist" />
                    </RadioGroup>
                    <ButtonContainer>
                        <Button text="Login" disabled={!email || !password || !userType} />
                    </ButtonContainer>
                </Card>
			</Container>
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
    width: 100%;
    text-align: center;
`;

export default Login;
