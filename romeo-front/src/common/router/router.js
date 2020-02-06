import React from "react";
import { Router, Switch } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import history from "./history";
import { setAuth } from "common/actions/auth";
import { connect } from "react-redux";
import Landing from "modules/";
import Profile from "modules/profile/";
import Login from "modules/loginreg/"


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router history={history}>
                    <Switch>
                        <PublicRoute path="/login" component={Login} exact/>
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/" component={Landing} exact/>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(
	mapStateToProps,
	{ setAuth }
)(AppRouter);