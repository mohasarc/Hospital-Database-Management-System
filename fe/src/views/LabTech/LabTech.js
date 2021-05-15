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
		// console.log("**************************");
		this.fetchTests();
	}

	render() {
		return (
			<div>
				<NavbarGroup align={Alignment.RIGHT}>
					<NavbarHeading align={Alignment.LEFT}>
						<strong>LT Profile</strong>
					</NavbarHeading>
					<NavbarDivider />
					<Button className={Classes.MINIMAL} icon="person" text={TABS.PersonalInfo.text}
						onClick={() => this.setState({ activePage: TABS.PersonalInfo.value })} />
					<Button className={Classes.MINIMAL} icon="lab-test" text={TABS.Tests.text}
						onClick={() => this.setState({ activePage: TABS.Tests.value })} />
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
		})
	}

	renderBody = () => {
		const { activePage } = this.state;
		switch (activePage) {
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
			case TABS.Tests.value:
				return (
					<TestsView assigned={this.state.assigned}
						preparing={this.state.preparing}
						finalized={this.state.finalized} />
				);
			default:
				break;
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
