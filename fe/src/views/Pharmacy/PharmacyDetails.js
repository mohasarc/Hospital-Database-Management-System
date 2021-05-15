import React, { useState, useEffect } from 'react';

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

import { H2, H3, Icon, NumericInput } from "@blueprintjs/core";
import styled from "styled-components";

import { Button, Classes, Spinner } from "@blueprintjs/core";
import moment from 'moment';
import axios from 'axios';


const Row = (props) => {
    const { med } = props;

    console.log("med ====> ", med);

    return (
        <React.Fragment>
            <TableRow key={`${med.name}`}>
                <TableCell >{med.name}</TableCell>
                <TableCell >{med.expiry_date}</TableCell>
                <TableCell >{med.inventory_count}</TableCell>
                <TableCell>
                    {<Button text="Remove" intent="danger" className={Classes.MINIMAL} icon="trash" onClick={() => { }} />}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const PharmacyDetails = (props) => {
    const { phar } = props;

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        fetchMeds();
    }, []);

    const fetchMeds = async () => {
        const url = `http://localhost:8000/pharmacy_inventory/inventory/${phar?.phmcy_id}`;
        const meds = await (await axios.get(url)).data;
        setMedicines(meds);
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}><H2>{phar?.name}</H2></div>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <H3 style={{ margin: "5px 5px" }}>Medicines</H3>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Inventory Count</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medicines?.length === 0 && <H2>No Tests Found!</H2>}
                        {medicines?.map((med) => (
                            <Row key={`${med.phmcy_id}-${med.name}`} med={med} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}


export default PharmacyDetails;


