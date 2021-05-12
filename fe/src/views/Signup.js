import React, { PureComponent } from "react";
import styled from "styled-components";

class Signup extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<Container>
				<div>Signup</div>
			</Container>
		);
	}
}

// first_name,
// middle_name,
// last_name,
// dob,
// apt_num,
// street_name,
// street_num,
// city,
// state,
// zip,
// country,
// country_code,
// number,
// gender,
// e_mail,
// password,
const Container = styled.div``;

export default Signup;
