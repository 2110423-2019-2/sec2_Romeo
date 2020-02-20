import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Tag } from "antd";
import { getCurrentClient } from "logic/Client";
import { getPortfolio } from "logic/Portfolio";
import { connect } from "react-redux"
import { formatDate } from "common/date";
import moment from "moment";
import JobCalendar from "./calendar";
import { styleColors } from "../../common/style-colors";

class Profile extends React.Component {
    state = {
        display: 0
    }

    render() {
        const currentClient = getCurrentClient();
        const currentPortfolio = getPortfolio();

        
        const { username } = this.props.match.params;
        const { photos } = currentPortfolio;
        
        if (currentClient && currentClient.username === username && currentClient.type !== 'PHOTOGRAPHER') {
            return <Redirect to="/"/>
        }

        const { isAuth } = this.props;
        const { display } = this.state;
        
        return (
            <div className="d-flex-md align-stretch bg-white">
                <div
                    className="sidebar-profile pa-3"
                >
                    { currentClient && currentClient.username === username && (
                        <React.Fragment>
                            <h1 className="mb-1">
                                {currentClient.firstName} {currentClient.lastName}
                            </h1>
                        </React.Fragment>
                    )}
                    <h3 className="mb-2">{username}</h3>
                    <span className="t-color-light d-block mb-4">Last Online Time: {formatDate(moment(new Date()))}</span>
                    <div className="mb-3">
                        <div className="secondary-label mb-2">
                            Equipment
                        </div>
                        { currentClient.equipment.map((e,i) => (
                            <div className="snippet secondary" key={i + e}>
                                {e}
                            </div>
                        ))}
                    </div>
                    <div className="mb-3">
                        <div className="secondary-label mb-2">
                            Styles
                        </div>
                        { currentClient.styles.map((e,i) => (
                            <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                {e}
                            </Tag>
                        ))}
                    </div>
                    
                    { isAuth && currentClient.username === username && (
                        <Link to="/client/edit-profile">
                            <Button type="primary" shape="round">Edit Profile</Button>
                        </Link>
                    )}<br/>
                    <div className="profile-tabs mt-4">
                        <div className="secondary-label mb-2">
                            Show
                        </div>
                        <div 
                            className={`profile-tabs-item ${display === 0 && 'active'}`}
                            onClick={() => this.setState({ display: 0})}
                        >
                            Portfolio
                        </div>
                        <div 
                            className={`profile-tabs-item ${display === 1 && 'active'}`}
                            onClick={() => this.setState({ display: 1})}
                        >
                            Available Times
                        </div>
                    </div>
                </div>
                <div className="container with-sidebar full-width-xs portfolio-container">
                { display === 0 ? (
                    <div className="photo-grid">
                        { photos.map((e,i) => (
                            <div  className="photo-grid-photo">
                                <img src={e} key={e} alt=""/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="pa-4">
                        <JobCalendar/>
                    </div>
                ) }
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, null)(Profile)