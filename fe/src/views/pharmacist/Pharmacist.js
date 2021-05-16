import React, { PureComponent } from "react";
import {
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Button,
    Classes,
    Alignment,
    Spinner,
} from "@blueprintjs/core";

import styled from "styled-components";
import { Form } from "react-bootstrap";
import axios from "axios";
import PharmacyDetails from "../Pharmacy/PharmacyDetails";
import PharmacyView from "./PharmacyView";
import { USER_PROPERTIES } from "../Patient/UserProperties";


const TABS = {
    Pharmacies: {
        value: "PHARMACIES",
        text: "Pharmacy",
    },
    PersonalInfo: { value: "PERSONAL_INFO", text: "Personal Information" },
};

class Pharmacist extends PureComponent {
    constructor() {
        console.log(JSON.parse(localStorage.getItem("user")));
        super();
        this.state = {
            activeTab: TABS.Pharmacies.value,
            pharmacy: {},
            loading: false,
            user: JSON.parse(localStorage.getItem("user")),
        };
    }

    componentDidMount() {
        if (!this.state.pharmacy || !this.state.pharmacy.phmcy_id) {
            this.props.history.push("/login");
        }
        this.fetchPharmacy();
    }

    fetchPharmacy = async () => {
        const url = `http://localhost:8000/pharmacist/${this.state.user?.ph_id}`;
        this.setState({ loading: true });
        const pharmacy = await (await axios.get(url)).data[0];
        this.setState({ pharmacy: pharmacy, loading: false });
    }

    render() {
        return (
            <div>
                <NavbarGroup align={Alignment.RIGHT} style={{ marginRight: "10px" }}>
                    <NavbarHeading align={Alignment.LEFT}>
                        <strong>Welcome {this.state.user?.first_name}</strong>
                    </NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="office" text={TABS.Pharmacies.text}
                        active={this.state.activeTab === TABS.Pharmacies.value}
                        onClick={() => this.setState({ activeTab: TABS.Pharmacies.value })} />
                    <Button className={Classes.MINIMAL} icon="person" text={TABS.PersonalInfo.text}
                        active={this.state.activeTab === TABS.PersonalInfo.value}
                        onClick={() => this.setState({ activeTab: TABS.PersonalInfo.value })} />
                    <Button className={Classes.MINIMAL} icon="log-out" text={"Logout"} onClick={() => {
                        localStorage.removeItem("user");
                        this.props.history.push("/login");
                    }} />
                </NavbarGroup>
                <Body>
                    {this.renderBody()}
                </Body>
            </div>
        );
    }



    renderBody = () => {
        const { activeTab } = this.state;
        switch (activeTab) {
            case TABS.PersonalInfo.value:
                return (
                    <PropertiesContainer>
                        {USER_PROPERTIES.map((property, index) => {
                            if (this.state.user[property.value]) {
                                return (
                                    <Form.Group controlId={"property " + index} id={"property " + index} >
                                        <Form.Label>
                                            {property.text}
                                        </Form.Label>
                                        <Form.Control placeholder="Fetching Details" value={this.state.user[property.value]} readOnly />
                                    </Form.Group>
                                );
                            }
                            return null;
                        })}
                    </PropertiesContainer>
                );
            default:
                return (
                    <ListContainer>
                        {this.state.loading ? <SpinDiv><Spinner /></SpinDiv> :
                            <PharmacyView pharmacy={this.state.pharmacy} />
                        }
                    </ListContainer>
                );
        }
    };

}

const PropertiesContainer = styled.div`
	width: 30%;
`;

const Body = styled.div`
	position: absolute;
	top: 45px;
	left: 10px;
	width: 100%;
	height: 100%;
	border-top: 1px solid grey;
`;

const SpinDiv = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
`;

const ListContainer = styled.div`
	position: absolute;
	left: 50%;
	top: 5%;
	width: 60%;	
	transform: translate(-50%);
`;


export default Pharmacist;
