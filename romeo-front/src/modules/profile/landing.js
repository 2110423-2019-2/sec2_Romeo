import React from "react";
import { Link } from "react-router-dom";

class Landing extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Your Profile</h1>
                <p>Your name here and other details here.</p>
                <Link to="/profile/edit">
                    <button>Edit Profile</button>
                </Link>
            </React.Fragment>
        )
    }
}

export default Landing