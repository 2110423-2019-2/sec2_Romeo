import React from "react";
import {  Route, Switch } from "react-router-dom";
import Edit from "./edit";
import Landing from "./landing"

class Profile extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route path="/profile/edit" exact component={Edit} />
                    <Route path="/profile" exact component={Landing} />
                </Switch>
            </React.Fragment>
        )
    }
}

export default Profile