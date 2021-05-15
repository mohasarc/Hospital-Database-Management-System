import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


import { Button, Classes, Spinner } from "@blueprintjs/core";
import moment from 'moment';
import axios from 'axios';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});


const Row = (props) => {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();
    const [comps, setComps] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchComponents = async (t_id) => {
        const url = `http://localhost:8000/management/test/comps/${t_id}`;
        setOpen(!open);
        setLoading(true);
        const components = await (await axios.get(url)).data;
        setComps(components);
        setLoading(false);
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">{row.t_id}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.appt_id}</TableCell>
                <TableCell align="left">{moment(row.date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>
                    {<Button className={Classes.MINIMAL} icon={!open ? "chevron-down" : "chevron-down"} onClick={() => fetchComponents(row.t_id)} />}
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
                                        <TableCell align="left">Min. Interval</TableCell>
                                        <TableCell align="left">Max. Interval</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {comps.map((comp) => (
                                        <TableRow key={comp.c_name}>
                                            <TableCell component="th" scope="row">
                                                {comp.c_name}
                                            </TableCell>
                                            <TableCell>{comp.min_interval}</TableCell>
                                            <TableCell align="left">{comp.max_interval}</TableCell>
                                            <TableCell align="right">
                                                {<Button text="Add Score" className={Classes.MINIMAL} rightIcon="add" intent="primary" onClick={() => console.log("++++++++++")} />}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {/* {loading ? <Spinner /> : <>
                                        
                                    </>} */}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

export default function CollapsibleTable(props) {
    console.log("list prosp ===> ", props.rows);
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Appt. ID</TableCell>
                        <TableCell align="left">Date</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}