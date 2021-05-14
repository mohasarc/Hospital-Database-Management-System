import { RoutePaths } from "./RoutePaths";
import { Route, Switch } from "react-router-dom";

import Login from "../views/Login";
import Signup from "../views/Signup";
import Patient from '../views/Patient';

const Routes = () => {
	return (
		<Switch>
			<Route path={RoutePaths.Login} component={Login} exact />
			<Route path={RoutePaths.Signup} component={Signup} exact />
			<Route path={RoutePaths.PatientView} component={Patient} exact />
		</Switch>
	);
};

export default Routes;
