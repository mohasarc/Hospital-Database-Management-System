import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Collapse,
    TableHead,
    TableRow,
    Paper,
}
    from "@material-ui/core";

import { H2, H3, Button, FormGroup, InputGroup, Card, Classes, RadioGroup, Radio, NumericInput } from "@blueprintjs/core";

import styled from "styled-components";

import { Spinner } from "@blueprintjs/core";
import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import moment from 'moment';
import axios from 'axios';


const Row = (props) => {
    const { med, onRemove } = props;
    const [count, setCount] = useState(0);

    return (
        <React.Fragment>
            <TableRow key={`${med.name}`}>
                <TableCell >{med.name}</TableCell>
                <TableCell >{moment(med.expiry_date).format('YYYY-MM-DD')}</TableCell>
                <TableCell >{med.inventory_count}</TableCell>
                <TableRow >
                    <NumericInput allowNumericCharactersOnly={true} min="0" max={med.inventory_count > 0 ? med.inventory_count : 0} value={count} onValueChange={(v) => setCount(v)} />
                    <Button text={med.inventory_count > 0 ? "Deduct" : "Delete"} intent="danger" className={Classes.MINIMAL} icon={med.inventory_count > 0 ? "minus" : "trash"} onClick={() => onRemove(med, count)} style={{ margin: "5px" }} />
                </TableRow>
            </TableRow>
        </React.Fragment>
    );
}


const PharmacyView = (props) => {
    const { pharmacy } = props;
    const [loading, setLoading] = useState(true);
    const [medicines, setMedicines] = useState([]);
    const [addMed, setAddMed] = useState(false);
    const [newMed, setNewMed] = useState({
        name: '',
        phmcy_id: pharmacy.phmcy_id,
        expiry_date: '',
        inventory_count: '',
    });

    useEffect(() => {
        fetchMeds();
    }, []);

    const fetchMeds = async () => {
        const phmcy_id = pharmacy.phmcy_id;
        const url = `http://localhost:8000/pharmacy_inventory/inventory/${phmcy_id}`;
        const meds = await (await axios.get(url)).data;
        setMedicines(meds);
        setLoading(false);
    }


    const addNewMedicine = async () => {
        try {
            const url = `http://localhost:8000/pharmacy_inventory/inventory/medicine`;
            const res = await axios.post(url, newMed);
            toast("Medicine was added!", { style: { backgroundColor: "green", color: "white" } });
            setMedicines([...medicines, newMed]);
            setAddMed(false);
        } catch (error) {
            toast(error.message, { style: { backgroundColor: "red", color: "white" } });
        }
    }

    const removeNMed = async (med, count) => {
        if (med.inventory_count - count < 0) {
            toast(`Cannot remove ${count} ${med.name}(s).`, { style: { backgroundColor: "red", color: "white" } });
        }
        else {
            try {
                if (med.inventory_count > 0) {
                    const url = `http://localhost:8000/pharmacy_inventory/inventory/medicine`;
                    const body = { name: med.name, phmcy_id: pharmacy.phmcy_id, count: count };
                    const res = await axios.put(url, body);
                    const meds = [];
                    medicines.forEach(m => {
                        if (m.name === med.name) m.inventory_count -= count;
                        meds.push(m);
                    })
                    toast(`Removed ${count} ${med.name}(s)`, { style: { backgroundColor: "green", color: "white" } });
                    setMedicines(meds);
                }
                else {
                    const url = `http://localhost:8000/pharmacy_inventory/inventory/medicine`;
                    const body = { name: med.name, phmcy_id: pharmacy.phmcy_id };
                    const res = await axios.delete(url, { data: body });
                    const meds = medicines.filter((m) => m.name != med.name);
                    toast("Removed from inventory", { style: { backgroundColor: "green", color: "white" } });
                    setMedicines(meds);
                }
            } catch (error) {
                toast(error.message, { style: { backgroundColor: "red", color: "white" } });
            }
        }
    }

    const renderAddForm = () => {
        const disabled = !newMed.name || !newMed.inventory_count || newMed.inventory_count === '0' || !newMed.expiry_date;
        return (
            <PDiv>
                {/* <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}> */}
                <Collapse in={addMed} timeout="auto" unmountOnExit>
                    {/* <Container> */}
                    <Card>
                        {/* <h3 className="bp3-heading">Login</h3> */}
                        <FormGroup label="Name" labelFor="name" labelInfo="(required)">
                            <InputGroup id="name" placeholder="Name" type="text" onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                        </FormGroup>
                        <FormGroup label="Inventory Count" labelFor="inventory_count" labelInfo="(required)">
                            <InputGroup id="inventory_count" placeholder="Inventory Count" type="text" onChange={e => setNewMed({ ...newMed, inventory_count: e.target.value })} />
                        </FormGroup>

                        <FormGroup label="Expiry Date" labelFor="expiry_date" labelInfo="(required)">
                            <InputGroup id="expiry_date" placeholder="Expiry Date" type="text" onChange={e => setNewMed({ ...newMed, expiry_date: e.target.value })} />
                        </FormGroup>

                        <PDiv>
                            <Button text="Add" disabled={disabled} rightIcon="chevron-right" intent="success" onClick={addNewMedicine} />
                        </PDiv>
                    </Card>
                    {/* </Container> */}
                </Collapse>
                {/* </TableCell> */}
            </PDiv>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <H2>{pharmacy?.name}</H2>
            </div>
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
                    {
                        loading ? <SpinDiv><Spinner /></SpinDiv> :
                            <TableBody>
                                {medicines?.length === 0 && <H2>No Medicines Found!</H2>}
                                {medicines?.map((med) => (
                                    <Row key={`${med.phmcy_id}-${med.name}`} med={med} onRemove={removeNMed} />
                                ))}
                            </TableBody>
                    }
                </Table>

            </TableContainer>
            <PDiv>
                <Button icon={addMed ? "chevron-up" : "chevron-down"} intent="primary"
                    text={!addMed ? "Add Medicine" : "Cancel"} onClick={() => setAddMed(!addMed)} />
            </PDiv>
            {renderAddForm(addMed)}
        </>
    );
}

const SpinDiv = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
`;

const PDiv = styled.div`
    width: 100%;
    height: 100%;    
    padding-top: 10px;
`;


export default PharmacyView;


