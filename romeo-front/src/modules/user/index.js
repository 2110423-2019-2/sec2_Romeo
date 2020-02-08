import React from "react"
import { Switch, Route, Redirect, NavLink} from "react-router-dom";
import Edit from "./edit";
import Display from "./display";
import Password from "./password"
import Reservations from "./reservations";
import EditPortfolio from "./edit-portfolio"

import { Menu, Icon } from 'antd';

class UserLanding extends React.Component {
    render() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { type } = currentUser;
        console.log(type);
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
                            to="/user/display"
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
                        <Route path="/user/display/edit/password" component={Password} />
                        <Route path="/user/display/edit" component={Edit} />
                        <Route path="/user/display" exact component={Display} />
                        <Route path="/user/reservations" exact component={Reservations} />
                        <Route path="/user/edit-portfolio" exact component={EditPortfolio} />
                        <Route path="/user" exact component={RedirectToDisplay} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const RedirectToDisplay = () => (
    <Redirect to="/user/display" />
)

export default UserLanding