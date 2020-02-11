import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import TransparentNav from "../../components/TransparentNav";

const PublicRoute = props => {
    let { isAuth, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
				<React.Fragment>
					<TransparentNav/>
					<main className="main-content">
						<Component {...props} />
					</main>
				</React.Fragment>
			}
        />
	);
}

const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(mapStateToProps)(PublicRoute);