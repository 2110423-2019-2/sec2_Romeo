import React from "react";
import { Link } from "react-router-dom"
import { Button } from 'antd';

import { connect } from "react-redux";
import { signOut } from "common/actions/auth";
import history from "common/router/history";
import SignInRegModal from "modules/signinreg/";

class Nav extends React.Component {
    state = {
        showSignIn: false,
        showSignUp: false
    }
    render() {
        const { showSignUp, showSignIn } = this.state;
        const { signOut, isAuth } = this.props;
        return (
            <nav className="main-nav" style={{ zIndex: 9999 }}>
                <div className="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <h3 className="ma-0">Photo Bro</h3>
                    </Link>
                    { isAuth ? (
                        <Button type="primary" onClick={() => signOut(history)}>Sign Out</Button>
                    ) : (
                        <div>
                            <Button type="secondary" className="mr-2" onClick={() => this.setState({
                                showSignIn: true
                            })}>Sign In</Button>
                            <Button type="primary" onClick={() => this.setState({
                                showSignUp: true
                            })}>Sign Up</Button>
                        </div>
                    )}
                    <SignInRegModal 
                        visible={showSignIn || showSignUp} 
                        show={showSignIn ? "SIGN_IN" : "REG" } 
                        onCancel={() => this.setState({ showSignIn: false, showSignUp: false})}
                    />
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(
    mapStateToProps,
    { signOut }
)(Nav);

