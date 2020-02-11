import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Icon } from "antd";
import { getCurrentClient } from "logic/Client";
import { getPortfolio } from "logic/Portfolio";
import { connect } from "react-redux"
import { formatDate } from "common/date";
import moment from "moment";

class Profile extends React.Component {
    render() {
        const currentClient = getCurrentClient();
        const currentPortfolio = getPortfolio();

        
        const { username } = this.props.match.params;
        const { photos } = currentPortfolio;
        
        if (currentClient && currentClient.username === username && currentClient.type !== 'PHOTOGRAPHER') {
            return <Redirect to="/"/>
        }

        const { isAuth } = this.props;
        return (
            <div className="d-flex-md align-stretch bg-white">
                <div
                    className="sidebar-profile pa-4"
                >
                    <div className="profile-image mb-4">
                        <Icon type="user"/>
                    </div>
                    { currentClient && currentClient.username === username && (
                        <h1 className="mb-1">{currentClient.firstName} {currentClient.lastName}</h1>
                    )}
                    <h3 className="mb-2">{username}</h3>
                    <span className="t-color-light d-block mb-4">Last Online Time: {formatDate(moment(new Date()))}</span>
                    { isAuth && currentClient.username === username && (
                        <Link to="/client/edit-profile">
                            <Button type="primary">Edit Profile</Button>
                        </Link>
                    )}<br/>
                    
                </div>
                <div className="container with-sidebar full-width-xs portfolio-container">
                    <div className="photo-grid">
                        { photos.map((e,i) => (
                            <div  className="photo-grid-photo">
                                <img src={e} key={e} alt=""/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, null)(Profile)