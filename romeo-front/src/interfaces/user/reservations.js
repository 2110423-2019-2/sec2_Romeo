import React from "react"
import { Redirect } from "react-router-dom";

class Reservations extends React.Component {
    render() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser.type !== 'CUSTOMER') {
            return <Redirect to="/"/>
        }
        return (
            <React.Fragment>
                <h1>My Reservations</h1>
            </React.Fragment>
        )
    }
}

export default Reservations;