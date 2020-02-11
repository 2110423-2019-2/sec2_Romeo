import React from "react"
import { Redirect } from "react-router-dom";

class EditPortfolio extends React.Component {
    render() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser.type !== 'PHOTOGRAPHER') {
            return <Redirect to="/"/>
        }
        return (
            <React.Fragment>
                <h1>Edit Portfolio</h1>
            </React.Fragment>
        )
    }
}

export default EditPortfolio;