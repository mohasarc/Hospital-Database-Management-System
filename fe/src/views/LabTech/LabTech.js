import React, { PureComponent } from "react";
import {
	NavbarDivider,
	NavbarGroup,
	NavbarHeading,
	Button,
	Classes,
	Alignment,
} from "@blueprintjs/core";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import axios from "axios";
import { USER_PROPERTIES } from "../Patient/UserProperties";
import TestsView from "./TestsView";
import { TEST_STATUS } from '../../constants';
import { ToastContainer, toast } from 'react-toastify';


const TABS = {
	PersonalInfo: {
		value: "PERSONAL_INFORMATION",
		text: "Personal Information",
	},
	Tests: { value: "TESTS", text: "Tests" },
};

class LabTech extends PureComponent {
	constructor() {
		console.log(JSON.parse(localStorage.getItem("user")));
		super();
		this.state = {
			activeTab: TABS.Tests.value,
			assigned: [],
			preparing: [],
			finalized: [],
			loading: false,
			user: JSON.parse(localStorage.getItem("user")),
		};
	}

	componentDidMount() {
		if (!this.state.user || !this.state.user.lt_id) {
			this.props.history.push("/login");
		}
		else
			this.fetchTests();
	}

	render() {
		return (
			<div>
				<NavbarGroup align={Alignment.RIGHT}>
					<NavbarHeading align={Alignment.LEFT}>
						<strong>{this.state.user.first_name}</strong>
					</NavbarHeading>
					<NavbarDivider />
					<Button className={Classes.MINIMAL} icon="person" text={TABS.PersonalInfo.text}
						active={this.state.activeTab === TABS.PersonalInfo.value}
						onClick={() => this.setState({ activeTab: TABS.PersonalInfo.value })} />
					<Button className={Classes.MINIMAL} icon="lab-test" text={TABS.Tests.text}
						active={this.state.activeTab === TABS.Tests.value}
						onClick={() => this.setState({ activeTab: TABS.Tests.value })} />
					<Button className={Classes.MINIMAL} icon="log-out" text={"Logout"} onClick={() => {
						localStorage.removeItem("user");
						this.props.history.push("/login");
					}} />
				</NavbarGroup>
				<Body>{this.renderBody()}</Body>
			</div>
		);
	}

	fetchTests = () => {
		const url = `http://localhost:8000/laboratory/lt/tests/${this.state.user.lt_id}`;
		axios.get(url).then((res) => {
			const assigned = res.data.filter((test) => test.status === TEST_STATUS.assigned);
			const preparing = res.data.filter((test) => test.status === TEST_STATUS.preparing);
			const finalized = res.data.filter((test) => test.status === TEST_STATUS.finalized);
			this.setState({ assigned: assigned, preparing: preparing, finalized: finalized })
		}).catch(error => {
			toast(error.message, { style: { backgroundColor: "red", color: "white" } })
		});
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
					<TestsView assigned={this.state.assigned}
						preparing={this.state.preparing}
						finalized={this.state.finalized} onScoreAdded={this.fetchTests} />
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

const PropertiesContainer = styled.div`
	width: 30%;
`;


export default LabTech;
