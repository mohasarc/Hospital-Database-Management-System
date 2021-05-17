import React, { useState, useRef } from 'react';
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

import { H2, Icon, NumericInput } from "@blueprintjs/core";

import { Button, Classes, Spinner } from "@blueprintjs/core";
import moment from 'moment';
import axios from 'axios';

const AddScore = (props) => {
    const { comp, onClick } = props;
    const [val, setVal] = useState(0);

    return (
        <>
            <NumericInput allowNumericCharactersOnly={true} min="0" max={comp.max_interval} value={val} onValueChange={(v) => setVal(v)} />
            <Button text="Add Score" className={Classes.MINIMAL} rightIcon="add" intent="primary" onClick={() => onClick(val, comp)} />
        </>
    );

}

const Row = (props) => {
    const { test, withInput, onScoreAdded } = props;
    const [open, setOpen] = useState(false);
    const [comps, setComps] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchComponents = async (t_id) => {
        const url = `http://localhost:8000/laboratory/lt/tests/${test.lt_id}/${test.appt_id}/${test.t_id}`;
        setOpen(!open);
        setLoading(true);
        const components = await (await axios.get(url)).data;
        setComps(components);
        setLoading(false);
    }

    const addScoreHandler = async (score, comp) => {
        try {
            // Add component result        
            const url = `http://localhost:8000/appointment/test/comps`;
            const body = { t_id: test.t_id, c_id: comp.c_id, appt_id: test.appt_id, score: score };
            const res = await axios.post(url, body);
            toast('Successfuly added score!', { style: { backgroundColor: "green", color: "white" } });
            props.onScoreAdded();
        } catch (error) {
            toast(error.message, { style: { backgroundColor: "green", color: "white" } });
        }
    }

    const buildCompItem = (comp) => {
        return (
            <>
                <TableRow key={`${comp.c_id}-${comp.t_id}`}>
                    <TableCell component="th" scope="row">
                        {comp.c_name}
                    </TableCell>
                    <TableCell>{comp.min_interval}</TableCell>
                    <TableCell >{comp.max_interval}</TableCell>
                    {comp.score && <TableCell >{comp.score}</TableCell>}

                    {(!withInput || comp.score) &&
                        <>
                            <TableCell align="left">
                                <Icon icon="tick-circle" intent="success" />
                            </TableCell>
                        </>}
                    {<TableCell align="right">
                        {(withInput && !comp.score) &&
                            <>
                                <TableRow>
                                    <AddScore comp={comp} onClick={addScoreHandler} />
                                </TableRow>
                            </>}
                    </TableCell>}
                </TableRow>
            </>
        );
    }

    return (
        <React.Fragment>
            <TableRow key={`${test.t_id}-${test.appt_id}`}>
                <TableCell >{test.t_id}</TableCell>
                <TableCell >{test.name}</TableCell>
                <TableCell >{test.appt_id}</TableCell>
                <TableCell >{moment(test.date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>
                    {<Button className={Classes.MINIMAL} icon={!open ? "chevron-down" : "chevron-down"} onClick={() => fetchComponents(test.t_id)} />}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Components
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell >Min. Interval</TableCell>
                                        <TableCell >Max. Interval</TableCell>
                                        <TableCell >Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {comps.map(buildCompItem)}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const CollapsibleTable = (props) => {
    return (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Appt. ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tests.length === 0 && <H2>No Tests Found!</H2>}
                    {props.tests.map((test) => (
                        <Row key={`${test.appt_id}-${test.t_id}`} test={test}
                            withInput={props.withInput} onScoreAdded={props.onScoreAdded} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CollapsibleTable;


