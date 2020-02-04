import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

class Landing extends React.Component {
    render() {
        return (
            <div className="container mt-4">
                <h1>Your Profile</h1>
                <p>Your name here and other details here.</p>
                <Link to="/profile/edit">
                    <Button type="primary">Edit Profile</Button>
                </Link>
            </div>
        )
    }
}

export default Landing