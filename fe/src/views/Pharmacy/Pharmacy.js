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
import { USER_PROPERTIES } from "../Patient/UserProperties";
import PharmacyList from "./PharmacyList";
import Medicines from "./Medicines";


const TABS = {
    Pharmacies: {
        value: "PHARMACIES",
        text: "Pharmacies",
    },
    Medicine: { value: "MEDICINE", text: "Medicine" },
};

class Pharmacy extends PureComponent {
    constructor() {
        console.log(JSON.parse(localStorage.getItem("user")));
        super();
        this.state = {
            activeTab: TABS.Pharmacies.value,
            pharmacies: [],
            loading: false,
            user: JSON.parse(localStorage.getItem("user")),
        };
    }

    componentDidMount() {
        this.fetchPharmacies();
    }

    render() {
        return (
            <div>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarHeading align={Alignment.LEFT}>
                        <strong>Pharmacy</strong>
                    </NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="office" text={TABS.Pharmacies.text}
                        active={this.state.activeTab === TABS.Pharmacies.value}
                        onClick={() => this.setState({ activeTab: TABS.Pharmacies.value })} />
                    <Button className={Classes.MINIMAL} icon="unresolve" text={TABS.Medicine.text}
                        active={this.state.activeTab === TABS.Medicine.value}
                        onClick={() => this.setState({ activeTab: TABS.Medicine.value })} />
                </NavbarGroup>
                <Body>{this.renderBody()}</Body>
            </div>
        );
    }

    fetchPharmacies = async () => {
        const url = `http://localhost:8000/management/pharmacy`;
        this.setState({ loading: true });
        const phars = await (await axios.get(url)).data;
        this.setState({ pharmacies: phars, loading: false });
    }



    renderBody = () => {
        const { activeTab } = this.state;
        switch (activeTab) {
            case TABS.Medicine.value:
                return (
                    <Medicines />
                );
            default:
                return (
                    this.state.loading ? <Spinner /> :
                        <PharmacyList pharmacies={this.state.pharmacies} />
                );
        }
    };
}

const Body = styled.div`
	position: absolute;
	top: 45px;
	left: 10px;
	width: 100%;
	height: 100%;
	border-top: 1px solid grey;
`;



export default Pharmacy;
