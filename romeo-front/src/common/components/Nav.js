import React from "react";
import { Link } from "react-router-dom"
import { Button, Dropdown, Menu, Icon, Tag, notification } from 'antd';
import logo from "assets/logo.png";
import { connect } from "react-redux";
import { signOut } from "common/actions/auth";
import history from "common/router/history";
import SignInRegModal from "interfaces/signinreg/modal";
import { receiveNotifications, getNotificationText } from "logic/Notifications";

class Nav extends React.Component {
    state = {
        showSignIn: false,
        notifications: []
    }
    async componentDidMount() {
        const currentClient = JSON.parse(localStorage.getItem('currentClient'))
        if (this.props.isAuth && currentClient) {
            const n = await receiveNotifications(currentClient.username);
            this.setState({ notifications: n });
        }
    }
    render() {
        const { showSignIn, notifications } = this.state;
        const { signOut, isAuth, transparent } = this.props;
        const currentClient = JSON.parse(localStorage.getItem('currentClient'))
        return (
            <nav className={`main-nav ${transparent ? "transparent" : ""}`}>
                <div className="container d-flex align-center justify-space-between">
                    <Link to="/">
                        <div className="logo">
                            <img src={logo} alt="" />
                        </div>
                    </Link>
                    { isAuth && currentClient ? (
                        <div className="d-flex">
                            <div>
                                <Dropdown 
                                    overlay={() => (
                                        <Menu style={{ maxWidth: 300 }}>
                                            <Menu.Item>
                                                <Icon type="bell" className="mr-2"/><b>Notifications</b>
                                            </Menu.Item>
                                            { notifications && notifications.length > 0 && (
                                                <Menu.Item>
                                                    <span className="t-color-primary">Mark All as Read</span>
                                                </Menu.Item>
                                            )}
                                            <Menu.Divider/>
                                            { notifications && notifications.length > 0 ? 
                                                notifications.slice(0,4).map((e,i) => (
                                                    <Menu.Item 
                                                            key={`notif${e.noti_timestamp + i}`} 
                                                            className="pb-2 pt-2"
                                                            style={{ borderBottom: '1px solid #efefef' }}
                                                        >
                                                            <Link to="/client/reservations">
                                                                <div className="d-flex align-center" style={{ whiteSpace: "initial" }}>
                                                                    <div className="mr-2">
                                                                        { getNotificationText(e.noti_actor, e.noti_status) }
                                                                    </div>
                                                                { e.front_new && <Tag color="#f50">New</Tag> }
                                                                </div>
                                                            </Link>
                                                    </Menu.Item>
                                                )
                                            ) : (
                                                <Menu.Item>
                                                    <span className="t-color-light">There are no notifications.</span>
                                                </Menu.Item>
                                            )}
                                            <Menu.Item>
                                                <Link to="/client/notifications">View All</Link>
                                            </Menu.Item>
                                        </Menu>
                                    )} 
                                    trigger={['click']}
                                >
                                    <Button 
                                        type="default" 
                                        shape="circle" 
                                        icon="bell" 
                                        size="large" 
                                        className="mr-2"
                                    />
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
                                            <Menu.Item key="pho0">
                                                <Link to="/client/reservations">My Reservations</Link>
                                            </Menu.Item>
                                            <Menu.Item key="pho5">
                                                <Link to="/client/calendar">My Calendar</Link>
                                            </Menu.Item>
                                            <Menu.Item key="pho1">
                                                <Link to="/client/edit-portfolio">Edit Portfolio</Link>
                                            </Menu.Item>
                                            <Menu.Item key="pho2">
                                                <Link to="/client/edit-profile">Edit Profile</Link>
                                            </Menu.Item>
                                            <Menu.Item key="pho3">
                                                <Link to="/client/edit">Personal Information</Link>
                                            </Menu.Item>
                                            <Menu.Item key="pho4" onClick={() => signOut(history)}>
                                                <span className="t-color-error">Sign Out</span>
                                            </Menu.Item>
                                        </Menu>
                                    ) : (
                                        <Menu>
                                            <Menu.Item key="0" style={{ pointerEvents: 'none' }}>
                                                <Icon type="user" className="mr-2"/><b>{currentClient.username}</b>
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="cus1">
                                                <Link to="/client/reservations">My Reservations</Link>
                                            </Menu.Item>
                                            <Menu.Item key="cus5">
                                                <Link to="/client/calendar">My Calendar</Link>
                                            </Menu.Item>
                                            <Menu.Item key="cus2">
                                                <Link to="/client/edit">Personal Information</Link>
                                            </Menu.Item>
                                            <Menu.Item key="cus3" onClick={() => signOut(history)}>
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

