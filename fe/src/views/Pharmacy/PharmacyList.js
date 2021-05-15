import React, { useState } from 'react';

import {
    Box,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
}
    from "@material-ui/core";

import { H2, Icon, NumericInput } from "@blueprintjs/core";
import styled from "styled-components";

import { Button, Classes, Spinner } from "@blueprintjs/core";
import { useHistory } from 'react-router';
import PharmacyDetails from './PharmacyDetails';

const Row = (props) => {
    const { phar, onClick } = props;
    const [loading, setLoading] = useState(false);

    return (
        <React.Fragment>
            <TableRow key={`${phar.phmcy_id}`}>
                <TableCell >{phar.phmcy_id}</TableCell>
                <TableCell >{phar.name}</TableCell>
                <TableCell >{phar.room_no}</TableCell>
                <TableCell>
                    {<Button text="Details" intent="primary" className={Classes.MINIMAL} icon="list-detail-view" onClick={() => onClick(phar)} />}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}





const PharmacyList = (props) => {
    const { pharmacies } = props;
    const [openInfo, setOpenInfo] = useState(false);
    const [selectedPhar, setSelectedPhar] = useState({});

    const openDetails = (phar) => {
        setOpenInfo(true);
        setSelectedPhar(phar);
    }

    const pharList = () => {
        return (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Room NO</TableCell>
                            {/* <TableCell /> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pharmacies?.length === 0 && <H2>No Tests Found!</H2>}
                        {pharmacies?.map((phar) => (
                            <Row key={`${phar.phmcy_id}`} phar={phar} onClick={openDetails} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }




    return (
        <ListContainer >
            {openInfo ? <PharmacyDetails phar={selectedPhar} /> : pharList()}
        </ListContainer>
    );
}

const ListContainer = styled.div`
	position: absolute;
	left: 50%;
	top: 5%;
	width: 60%;	
	transform: translate(-50%);
`;

export default PharmacyList;


