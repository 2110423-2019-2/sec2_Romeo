import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button } from "antd";
import { connect } from "react-redux"

class Profile extends React.Component {
    render() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { type, username: currentUsername } = currentUser;
        if (type !== 'PHOTOGRAPHER') {
            return <Redirect to="/" />
        } 
        const { username } = this.props.match.params;

        const { isAuth } = this.props;
        return (
            <div className="container mt-4">
                <h1>Your Profile</h1>
                <p>Your username: {username}</p>
                { isAuth && currentUsername === username && (
                    <Link to="/user/display/edit">
                        <Button type="primary">Edit</Button>
                    </Link>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, null)(Profile)