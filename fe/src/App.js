import React from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";

import Routes from "./Routes/Routes";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
const App = () => {
	return (
		<Container>
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</Container>
	);
};

const Container = styled.div`
    margin: 0;
    padding: 0;
`;
export default App;
