import React from "react";
import { Router, Switch } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import history from "./history";
import { setAuth } from "common/actions/auth";
import { connect } from "react-redux";
import Profile from "modules/profile/";
import Listing from "modules/listing/"
import UserLanding from "modules/user";


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute path="/user" component={UserLanding}/>
                        <PublicRoute path="/profile/:username" component={Profile}/>
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