import React from "react"
import { Switch, Route, Redirect, NavLink} from "react-router-dom";
import Edit from "./edit";
import Password from "./password"
import Reservations from "./reservations";
import EditPortfolio from "./edit-portfolio"
import EditProfile from "./edit-profile"

import { Menu } from 'antd';

class UserLanding extends React.Component {
    render() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { type } = currentUser;
        return (
            <div className="d-flex align-stretch">
                <Menu
                    style={{ width: 256, height: '100%', position: 'fixed' }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    className="pt-0"
                >
                        <NavLink 
                            className="ant-menu-item" 
                            activeClassName="ant-menu-item-selected"
                            to="/user/edit"
                        >
                            Personal Information
                        </NavLink>
                    { type === 'PHOTOGRAPHER' && (
                        <NavLink 
                            className="ant-menu-item" 
                            activeClassName="ant-menu-item-selected"
                            to="/user/edit-portfolio"
                        >
                                Edit Portfolio
                        </NavLink>
                    )}
                    { type === 'PHOTOGRAPHER' && (
                        <NavLink 
                            className="ant-menu-item" 
                            activeClassName="ant-menu-item-selected"
                            to="/user/edit-profile"
                        >
                                Edit Profile
                        </NavLink>
                    )}
                    { type === 'CUSTOMER' && (
                        <NavLink 
                            className="ant-menu-item" 
                            activeClassName="ant-menu-item-selected"
                            to="/user/reservations"
                        >
                                My Reservations
                        </NavLink>
                    )}
                </Menu>
                <div className="container mt-4 with-sidebar pl-4">
                    <Switch>
                        <Route path="/user/edit/password" component={Password} />
                        <Route path="/user/edit" component={Edit} />
                        <Route path="/user/reservations" exact component={Reservations} />
                        <Route path="/user/edit-portfolio" exact component={EditPortfolio} />
                        <Route path="/user/edit-profile" exact component={EditProfile} />
                        <Route path="/user" exact component={RedirectToEdit} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const RedirectToEdit = () => (
    <Redirect to="/user/edit" />
)

export default UserLanding