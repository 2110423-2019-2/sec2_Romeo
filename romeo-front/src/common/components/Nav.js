import React from "react";
import { Link } from "react-router-dom"
import { Button, Dropdown, Menu, Icon } from 'antd';
import logo from "assets/logo.png";
import { connect } from "react-redux";
import { signOut } from "common/actions/auth";
import history from "common/router/history";
import SignInRegModal from "interfaces/signinreg/modal";
import MenuItem from "antd/lib/menu/MenuItem";

class Nav extends React.Component {
    state = {
        showSignIn: false
    }
    render() {
        const { showSignIn } = this.state;
        const { signOut, isAuth } = this.props;

        const currentClient = JSON.parse(localStorage.getItem('currentClient'))
        console.log(this.state);
        return (
            <nav className="main-nav">
                <div className="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <div className="logo">
                            <img src={logo} alt="" />
                        </div>
                    </Link>
                    { isAuth && currentClient ? (
                        <div className="d-flex">
                            <div>
                                <Dropdown overlay={() => (
                                    <Menu>
                                        <Menu.Item>
                                            <Icon type="bell" className="mr-2"/><b>Notifications</b>
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item>
                                            <Link to="#">1st Notification</Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link to="#">2nd Notification</Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link to="#">3rd Notification</Link>
                                        </Menu.Item>
                                    </Menu>
                                )} trigger={['click']}>
                                    <Button type="default" shape="circle" icon="bell" size="large" className="mr-3"/>
                                </Dropdown>
                            </div>
                            <div>
                                <Dropdown overlay={() => (
                                    currentClient.type === 1 ? (
                                        <Menu>
                                            <Menu.Item key="0">
                                                <Link to={"/profile/" + currentClient.username}>
                                                    <Icon type="user" className="mr-2"/><b>{currentClient.username}</b>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="2">
                                                <Link to="/client/edit-portfolio">Edit Portfolio</Link>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <Link to="/client/edit-profile">Edit Profile</Link>
                                            </Menu.Item>
                                            <Menu.Item key="1">
                                                <Link to="/client/edit">Personal Information</Link>
                                            </Menu.Item>
                                            <Menu.Item key="3" onClick={() => signOut(history)}>
                                                <span className="t-color-error">Sign Out</span>
                                            </Menu.Item>
                                        </Menu>
                                    ) : (
                                        <Menu>
                                            <Menu.Item key="0" style={{ pointerEvents: 'none' }}>
                                                <Icon type="user" className="mr-2"/><b>{currentClient.username}</b>
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="2">
                                                <Link to="/client/reservations">My Reservations</Link>
                                            </Menu.Item>
                                            <Menu.Item key="1">
                                                <Link to="/client/edit">Personal Information</Link>
                                            </Menu.Item>
                                            <Menu.Item key="3" onClick={() => signOut(history)}>
                                                <span className="t-color-error">Sign Out</span>
                                            </Menu.Item>
                                        </Menu>
                                    )
                                )} trigger={['click']}>
                                    <Button type="primary" shape="circle" icon="user" size="large"/>
                                </Dropdown>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Button 
                            type="secondary" 
                            className="mr-2"
                            htmlType="button" 
                            shape="round"
                            onClick={() => this.setState({
                                showSignIn: true
                            })}>Sign In</Button>
                            <Link to="/signup">
                                <Button type="primary" shape="round" htmlType="button">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                    { showSignIn && (
                        <SignInRegModal 
                            visible={showSignIn} 
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
    currentClient: state.auth.currentClient
})

export default connect(
    mapStateToProps,
    { signOut }
)(Nav);

