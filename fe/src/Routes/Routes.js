import { RoutePaths } from "./RoutePaths";
import { Route, Switch } from "react-router-dom";

import Login from "../views/Login";
import Signup from "../views/Signup";
import Patient from "../views/Patient/Patient";
import Management from "../views/Management/Management";
import DepartmentMan from "../views/Management/department_man";
import LabTech from "../views/LabTech/LabTech";
import Doctor from "../views/Doctor/Doctor";

import Pharmacy from '../views/Pharmacy/Pharmacy';
import PharmacyDetails from "../views/Pharmacy/PharmacyDetails";
import Pharmacist from "../views/pharmacist/Pharmacist";

const Routes = () => {
	return (
		<Switch>
			<Route path={RoutePaths.Login} component={Login} exact />
			<Route path={RoutePaths.Signup} component={Signup} exact />
			<Route path={RoutePaths.PatientView} component={Patient} exact />
			<Route path={RoutePaths.LtView} component={LabTech} exact />
			<Route path={RoutePaths.Management} component={Management} exact />
			<Route path={RoutePaths.DepartmentMan} component={DepartmentMan} exact />
			<Route path={RoutePaths.Doctor} component={Doctor} exact />
			<Route path={RoutePaths.Pharmacy} component={Pharmacy} exact />
			<Route path={RoutePaths.Pharmacist} component={Pharmacist} exact />
		</Switch>
	);
};

export default Routes;
