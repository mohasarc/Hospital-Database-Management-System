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

import { H2, Button, FormGroup, InputGroup, Card, Classes, RadioGroup, Radio } from "@blueprintjs/core";



import styled from "styled-components";

import { useHistory } from 'react-router';
import PharmacyDetails from './PharmacyDetails';
import axios from 'axios';

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
    const [addPhar, setAddMed] = useState(false);
    const [newPhar, setNewPhar] = useState({
        name: '',
        room_no: undefined,
    });

    const openDetails = (phar) => {
        setOpenInfo(true);
        setSelectedPhar(phar);
    }

    const onPharAddName = (val) => setNewPhar({ ...newPhar, name: val });
    const onPharAddRoom = (val) => setNewPhar({ ...newPhar, room_no: val });

    const addNewPhar = async () => {
        console.log(newPhar.name, newPhar.room_no);
        const url = 'http://localhost:8000/management/pharmacy';
        const res = await axios.post(url, newPhar);
        console.log(res);
    }

    const renderAddForm = () => {
        return (
            <PDiv>
                <TableRow>
                    {/* <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}> */}
                    <Collapse in={addPhar} timeout="auto" unmountOnExit>
                        {/* <Container> */}
                        <Card>
                            {/* <h3 className="bp3-heading">Login</h3> */}
                            <FormGroup label="Name" labelFor="name" labelInfo="(required)">
                                <InputGroup id="name" placeholder="Name" type="text" onChange={e => onPharAddName(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Room No" labelFor="roomNo" labelInfo="(required)">
                                <InputGroup id="roomNo" placeholder="Room No" type="text" onChange={e => onPharAddRoom(e.target.value)} />
                            </FormGroup>
                            <PDiv>
                                <Button text="Add" rightIcon="chevron-right" intent="success" onClick={addNewPhar} />
                            </PDiv>
                        </Card>
                        {/* </Container> */}
                    </Collapse>
                    {/* </TableCell> */}
                </TableRow>
            </PDiv>
        );
    }

    const pharList = () => {
        return (
            <>
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
                            {pharmacies?.length === 0 && <H2>No Pharmacies Found!</H2>}
                            {pharmacies?.map((phar) => (
                                <Row key={`${phar.phmcy_id}`} phar={phar} onClick={openDetails} />
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
                <PDiv>
                    <Button icon={addPhar ? "chevron-up" : "chevron-down"} intent="primary"
                        text={!addPhar ? "Add Pharmacy" : "Cancel"} onClick={() => setAddMed(!addPhar)} />
                </PDiv>
                {renderAddForm(addPhar, onPharAddName, onPharAddRoom)}
            </>
        );
    }

    return (
        <ListContainer >
            {openInfo ? <PharmacyDetails phar={selectedPhar} onBack={() => setOpenInfo(false)} />
                : pharList()}
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

const PDiv = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 10px;
`;

const Container = styled.div`
    width: 100%;        
`;

export default PharmacyList;


