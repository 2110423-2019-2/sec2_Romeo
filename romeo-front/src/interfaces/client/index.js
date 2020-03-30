import React from "react"
import { Switch, Route, Redirect, NavLink} from "react-router-dom";
import Edit from "./edit";
import Password from "./password"
import Reservations from "./reservations";
import EditPortfolio from "./edit-portfolio/"
import EditProfile from "./edit-profile/"
import { getCurrentClient } from "common/auth";

import { Menu } from 'antd';
import Notifications from "./notifications";

class ClientLanding extends React.Component {
    render() {
        const currentClient = getCurrentClient();
        const { type } = currentClient;
        return (
            <div className="d-flex align-stretch">
                <Menu
                    style={{ width: 256, height: '100%', position: 'fixed' }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    className="pt-0"
                >
                    { currentClient && (
                        <React.Fragment>
                            { type === 1 && (
                                <NavLink 
                                    className="ant-menu-item" 
                                    activeClassName="ant-menu-item-selected"
                                    to="/client/edit-portfolio"
                                >
                                        Edit Portfolio
                                </NavLink>
                            )}
                            { type === 1 && (
                                <NavLink 
                                    className="ant-menu-item" 
                                    activeClassName="ant-menu-item-selected"
                                    to="/client/edit-profile"
                                >
                                        Edit Profile
                                </NavLink>
                            )}
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/client/reservations"
                            >
                                    Reservations
                            </NavLink>
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/client/notifications"
                            >
                                All Notifications
                            </NavLink>
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/client/edit"
                            >
                                Personal Information
                            </NavLink>
                        </React.Fragment>
                    )}
                </Menu>
                <Switch>
                    <Route path="/client/edit/password" component={Password} />
                    <Route path="/client/edit" component={Edit} />
                    <Route path="/client/reservations" component={Reservations} />
                    <Route path="/client/notifications" component={Notifications} />
                    <Route path="/client/edit-portfolio" component={EditPortfolio} />
                    <Route path="/client/edit-profile" component={EditProfile} />
                    <Route path="/client" component={RedirectToEdit} />
                </Switch>
            </div>
        );
    }
}

const RedirectTo404 = () => (
    <Redirect to="/not-found" />
)

const RedirectToEdit = () => (
    <Redirect to="/client/edit" />
)

export default ClientLanding