import React from "react"
import { Redirect } from "react-router-dom";

class EditPortfolio extends React.Component {
    render() {
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));
        if (currentClient.type !== 'PHOTOGRAPHER') {
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