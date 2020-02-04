import React from "react";
import { Link } from "react-router-dom";

class Landing extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Welcome!</h1>
                <p>This is the first page that the user is going to see</p>
                <Link to="/profile">
                    <button>My Profile</button>
                </Link>
            </React.Fragment>
        )
    }
}

export default Landing