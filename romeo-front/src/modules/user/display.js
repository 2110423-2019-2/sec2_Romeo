// TODO: Displays Personal Information with edit button
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd"

class Display extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Personal Information</h1>
                <Link to="/user/display/edit">
                    <Button type="primary">Edit</Button>
                </Link>
            </React.Fragment>
        );
    }
}

export default Display;