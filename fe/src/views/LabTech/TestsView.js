import React, { useState } from 'react'
import CollapsibleTable from './CollapsibleTable'

import {
    NavbarGroup,
    Button,
    Classes,
    Alignment,
} from "@blueprintjs/core";

import styled from "styled-components";

const TEST_TABS = {
    Assigned: "Assigned",
    Preparing: "Preparing",
    Finalized: "Finalized",
};

const TestsView = (props) => {
    const [state, setState] = useState({
        activeTab: TEST_TABS.Assigned,
    });

    console.log("assig ===> ", props.assigned);
    console.log("prep ===> ", props.preparing);

    const renderSelectedTest = () => {
        switch (state.activeTab) {
            case TEST_TABS.Assigned:
                return (
                    <CollapsibleTable rows={props.assigned} />
                );

            case TEST_TABS.Preparing:
                return (
                    <CollapsibleTable rows={props.preparing} />
                );

            case TEST_TABS.Finalized:
                return (
                    <CollapsibleTable rows={props.finalized} />
                );

            default:
                break;
        }
    }

    return (
        <>
            <TestsContainer>
                <NavbarGroup align={Alignment.CENTER} style={{ justifyContent: "space-around" }}>
                    <Button className={Classes.MINIMAL} icon="tag" text={TEST_TABS.Assigned}
                        active={state.activeTab === TEST_TABS.Assigned}
                        intent="primary"
                        onClick={() => setState({ activeTab: TEST_TABS.Assigned })} />
                    <Button className={Classes.MINIMAL} icon="percentage" text={TEST_TABS.Preparing}
                        active={state.activeTab === TEST_TABS.Preparing}
                        intent="primary"
                        onClick={() => setState({ activeTab: TEST_TABS.Preparing })} />
                    <Button className={Classes.MINIMAL} icon="tick-circle" text={TEST_TABS.Finalized}
                        active={state.activeTab === TEST_TABS.Finalized}
                        intent="primary"
                        onClick={() => setState({ activeTab: TEST_TABS.Finalized })} />
                </NavbarGroup>
                <TestsBody>
                    {renderSelectedTest()}
                </TestsBody>
            </TestsContainer >
        </>
    );
}


const TestsContainer = styled.div`
	position: absolute;
	left: 50%;
	top: 5%;
	width: 60%;	
	transform: translate(-50%);
`;

const TestsBody = styled.div`
	width: 100%;
	height: 100%;	
	display: flex;
	justify-content: center;
`;

export default TestsView
