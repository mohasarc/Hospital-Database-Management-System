import { RoutePaths } from "./RoutePaths";
import { Route, Switch } from "react-router-dom";

import Login from "../views/Login";
import Signup from "../views/Signup";
import Patient from '../views/Patient/Patient';
import Management from '../views/Management/Management';

const Routes = () => {
	return (
		<Switch>
			<Route path={RoutePaths.Login} component={Login} exact />
			<Route path={RoutePaths.Signup} component={Signup} exact />
			<Route path={RoutePaths.PatientView} component={Patient} exact />
			<Route path={RoutePaths.Management} component={Management} exact />
		</Switch>
	);
};

export default Routes;
