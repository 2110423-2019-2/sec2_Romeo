import React from "react"
import { Switch, Route, Redirect} from "react-router-dom";
import Edit from "./edit";
import Password from "./password"

class UserLanding extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route path="/user/edit/password" exact component={Password} />
                    <Route path="/user/edit" exact component={Edit} />
                    <Route path="/user" exact component={RedirectToEdit} />
                </Switch>
            </React.Fragment>
        );
    }
}

const RedirectToEdit = () => (
    <Redirect to="/user/edit" />
)

export default UserLanding