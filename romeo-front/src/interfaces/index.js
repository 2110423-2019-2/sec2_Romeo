import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'antd';

class Landing extends React.Component {
    render() {
        return (
            <div className="container mt-4">
                <h1>Welcome!</h1>
                <p>This is the first page that the user is going to see</p>
                <Link to="/profile">
                    <Button type="primary">My Profile</Button>
                </Link>
            </div>
        )
    }
}

export default Landing