import React, { useState } from 'react';

import { toast } from 'react-toastify';

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
    const { phar, onViewDetails, onRemove,  } = props;

    return (
        <React.Fragment>
            <TableRow key={`${phar.phmcy_id}`}>
                <TableCell >{phar.phmcy_id}</TableCell>
                <TableCell >{phar.name}</TableCell>
                <TableCell >{phar.room_no}</TableCell>
                <TableCell>
                    {<Button text="Medicines" intent="primary" className={Classes.MINIMAL} icon="list-detail-view" onClick={() => onViewDetails(phar)} />}
                    {/* {<Button text="Assign Pharmacist" intent="success" className={Classes.MINIMAL} icon="add" onClick={() => onRemove(phar)} />} */}
                    {<Button text="Remove" intent="danger" className={Classes.MINIMAL} icon="trash" onClick={() => onRemove(phar)} />}
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
        try {
            const url = 'http://localhost:8000/management/pharmacy';
            const res = await axios.post(url, newPhar);
            pharmacies.push(newPhar);
            setAddMed(false);
            window.location.reload();
            toast('Pharmacy was added!', { style: { backgroundColor: "green", color: "white" } });
        } catch (error) {
            toast(error.message, { style: { backgroundColor: "red", color: "white" } });
        }
    }

    const removePhar = async (phar) => {
        try {
            const url = 'http://localhost:8000/management/pharmacy';
            const res = await axios.delete(url, { data: { phmcy_id: phar.phmcy_id } });
            window.location.reload();
            toast('Pharmacy was added!', { style: { backgroundColor: "green", color: "white" } });
        } catch (error) {

            toast(error.message, { style: { backgroundColor: "red", color: "white" } });
        }
    }

    const renderAddForm = () => {
        return (
            <PDiv>
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
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pharmacies?.length === 0 && <H2>No Pharmacies Found!</H2>}
                            {pharmacies?.map((phar) => (
                                <Row key={`${phar.phmcy_id}`} phar={phar}
                                    onViewDetails={openDetails} onRemove={removePhar} />
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


