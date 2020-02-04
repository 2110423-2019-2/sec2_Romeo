import React from "react";
import { Router, Switch } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import history from "./history";

import Landing from "../../modules/";
import Profile from "../../modules/profile/";


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/" component={Landing} exact/>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

export default AppRouter;