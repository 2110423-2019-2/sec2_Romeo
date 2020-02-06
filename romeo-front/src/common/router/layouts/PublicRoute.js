import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Nav from "../../components/Nav";

const PrivateRoute = props => {
    let { isAuth, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
				isAuth ? (
					<Redirect to="/" />
				) : (
					<Component {...props} />
				)
			}
        />
	);
}

const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(mapStateToProps)(PrivateRoute);