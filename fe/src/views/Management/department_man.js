import { Button, Divider, FormGroup, H3, H5, InputGroup } from "@blueprintjs/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from "axios";
import React, { PureComponent } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Loading from "../Loading";

class DepartmentMan extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
            departments: [],
            deptName: undefined,
        };
	}

	componentDidMount() {
        this.fetchAllDepartments();
	}

    fetchAllDepartments = () => {
        this.setState({ loading: true }, async () => {
			const departments = (await axios.get("http://localhost:8000/management/department")).data;
			this.setState({ loading: false, departments });
		});
    }

    async addDept() {
        if (this.state.deptName) {
            try {
                await axios.post("http://localhost:8000/management/department", {name: this.state.deptName});
                this.fetchAllDepartments();
            } catch (error) {
                console.log(error)
            }

            this.state.deptName = undefined;
        }
    }

	render() {
		const { loading } = this.state;
        return loading ? <Loading /> : <div>
				<H3>Welcome to the Management Page</H3>

                <H5>All departments</H5>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">name</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.departments.map((row) => (
                            <TableRow key={row.name}>
                            <TableCell component="th" scope="row">{row.name}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <>
                    <br/>
                    <br/>
                    <FormGroup label="Add another department" labelFor="deptName">
                        <InputGroup id="deptName" placeholder="Department Name" type="text"  onChange={e => this.setState({ deptName: e.target.value })}/>
                        <Button text="add" onClick={this.addDept.bind(this)}></Button>
                    </FormGroup>
                </>
			</div>
		;
	}

}

export default DepartmentMan;
