import { RoutePaths } from "./RoutePaths";
import { Route, Switch } from "react-router-dom";

import Login from "../views/Login";
import Signup from "../views/Signup";

const Routes = () => {
	return (
		<Switch>
			<Route path={RoutePaths.Login} component={Login} exact />
			<Route path={RoutePaths.Signup} component={Signup} exact />
		</Switch>
	);
};

export default Routes;
