import React from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";

const Loading = (props) => {
	return <StyledLoading color={"grey"} width="10%" height="10%" type="spin" />;
};

const StyledLoading = styled(ReactLoading)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;
export default Loading;
