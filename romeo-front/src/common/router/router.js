import React from "react";
import { Router, Switch } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import history from "./history";
import { setAuth } from "common/actions/auth";
import { connect } from "react-redux";
import Profile from "interfaces/profile";
import Listing from "interfaces/listing"
import ClientLanding from "interfaces/client";
import SignUp from "interfaces/signinreg/SignUp";
import Sample from "interfaces/sample";


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute path="/client" component={ClientLanding}/>
                        <PublicRoute path="/signup" component={SignUp}/>
                        <PublicRoute path="/profile/:username" component={Profile}/>
                        <PublicRoute path="/sample" component={Sample} exact/>
                        <PublicRoute path="/" component={Listing} exact/>
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