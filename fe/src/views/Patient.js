import React, { PureComponent } from "react";
import styled from 'styled-components';
import { Alignment, Button, Classes, Divider, H5, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Switch } from "@blueprintjs/core";

const TABS = {
    PersonalInfo: { value: "PERSONAL_INFORMATION", text: "Personal Information" },
    Appointments: { value: "APPOINTMENTS", text: "Appointments" }
}

class Patient extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            activePage: TABS.Appointments.value
        };
	}

	render() {
		return (
            <div>
                <NavbarGroup align={Alignment.RIGHT} >
                    <NavbarHeading align={Alignment.LEFT}>Patient Profile</NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="person" text={TABS.PersonalInfo.text} onClick={() => this.setState({ activePage: TABS.PersonalInfo.value })} />
                    <Button className={Classes.MINIMAL} icon="calendar"text={TABS.Appointments.text} onClick={() => this.setState({ activePage: TABS.Appointments.value })}  />
                </NavbarGroup>
                <Body>
                    Osama
                </Body>
            </div>

		);
	}
}


const Body = styled.div`
    position: absolute;
    top: 45px;
    width: 100%;
    border-top: 1px solid grey;
`;
export default Patient;
