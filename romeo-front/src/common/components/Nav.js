import React from "react";
import { Link } from "react-router-dom"
import { Button, Dropdown, Menu, Icon } from 'antd';

import { connect } from "react-redux";
import { signOut } from "common/actions/auth";
import history from "common/router/history";
import SignInRegModal from "modules/signinreg/modal";

class Nav extends React.Component {
    state = {
        showSignIn: false
    }
    render() {
        const { showSignUp, showSignIn, showModalDelay } = this.state;
        const { signOut, isAuth } = this.props;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        console.log(this.state);
        return (
            <nav className="main-nav">
                <div className="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <h3 className="ma-0">Photo Bro</h3>
                    </Link>
                    { isAuth && currentUser ? (
                        <Dropdown overlay={() => (
                            currentUser.type === "PHOTOGRAPHER" ? (
                                <Menu>
                                    <Menu.Item key="0">
                                        <Link to={"/profile/" + currentUser.username}>
                                            <Icon type="user" className="mr-2"/><b>{currentUser.username}</b>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="1">
                                        <Link to="/user/display">Personal Information</Link>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Link to="/user/edit-portfolio">Edit Portfolio</Link>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={() => signOut(history)}>
                                        <span className="t-color-error">Sign Out</span>
                                    </Menu.Item>
                                </Menu>
                            ) : (
                                <Menu>
                                    <Menu.Item key="0" style={{ pointerEvents: 'none' }}>
                                        <Icon type="user" className="mr-2"/><b>{currentUser.username}</b>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="1">
                                        <Link to="/user/display">Personal Information</Link>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Link to="/user/reservations">My Reservations</Link>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={() => signOut(history)}>
                                        <span className="t-color-error">Sign Out</span>
                                    </Menu.Item>
                                </Menu>
                            )
                        )} trigger={['click']}>
                            <Button type="primary" shape="circle" icon="user" />
                        </Dropdown>
                    ) : (
                        <div>
                            <Button 
                            type="secondary" 
                            className="mr-2"
                            htmlType="button" 
                            onClick={() => this.setState({
                                showSignIn: true
                            })}>Sign In</Button>
                            <Link to="/signup">
                                <Button type="primary" htmlType="button">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                    { showSignIn && (
                        <SignInRegModal 
                            visible={showSignIn || showSignUp} 
                            onCancel={() => {
                                this.setState({
                                    showSignIn: false,
                                })
                            }}
                        />
                    )}
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    currentUser: state.auth.currentUser
})

export default connect(
    mapStateToProps,
    { signOut }
)(Nav);

