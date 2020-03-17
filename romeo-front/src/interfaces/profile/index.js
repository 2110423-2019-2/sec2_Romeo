import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Tag, Icon } from "antd";
import { getPortfolio } from "logic/Portfolio";
import { connect } from "react-redux"
import { formatDate } from "common/date";
import moment from "moment";
import JobCalendar from "./calendar";
import { styleColors } from "../../common/style-colors";
import { getCurrentClientInfo } from "../../common/auth";

class Profile extends React.Component {
    state = {
        display: 0,
        currentClient: null,
        currentPortfolio: null
    }

    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        const currentPortfolio = getPortfolio(currentClient);
        console.log(currentClient);
        this.setState({
            currentClient,
            currentPortfolio
        });
    }

    render() {
        const { currentClient, currentPortfolio, display } = this.state;
        const { username } = this.props.match.params;
        if (currentClient && (currentClient.profile.username === username && currentClient.profile.user_type !== 1)) {
            return <Redirect to="/"/>
        }
        
        const { isAuth } = this.props;

        if (currentClient) {
            console.log(currentClient.profile.user.first_name);
        }

        return (
            <div className="d-flex-md align-stretch bg-white">
                { currentClient && (
                    <React.Fragment>
                        <div
                            className="sidebar-profile pa-3"
                        >
                            <h1 className="mb-1">
                                {currentClient.profile.user.first_name} {currentClient.profile.user.last_name}
                            </h1>
                            <Button type="default" size="large" shape="circle">
                                <Icon type="heart" style={{color:'red'}} theme='outlined' />
                            </Button>
                            <h3 className="mb-2">{username}</h3>
                            <span className="t-color-light d-block mb-4">Last Online Time: {formatDate(moment(new Date()))}</span>
                            <div className="mb-3">
                                <div className="secondary-label mb-2">
                                    Equipment
                                </div>
                                { currentClient.photographer_equipment.length > 0 ? (
                                    currentClient.photographer_equipment.map((e,i) => (
                                        <div className="snippet secondary" key={i + e.equipment_name}>
                                            {e.equipment_name}
                                        </div>
                                    ))
                                ) : (
                                    <span className="t-color-light">There is no equipment.</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="secondary-label mb-2">
                                    Styles
                                </div>
                                { currentClient.photographer_style.length > 0 ? (
                                    currentClient.photographer_style.map((e,i) => (
                                        <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                            {e}
                                        </Tag>
                                    ))
                                ) : (
                                    <span className="t-color-light">There are no styles.</span>
                                )}
                            </div>
                            
                            { isAuth && currentClient.profile.user.username === username && (
                                <React.Fragment>
                                    <Link to="/client/edit-profile">
                                        <Button type="primary" shape="round">Edit Profile</Button>
                                    </Link>
                                    <br/>
                                </React.Fragment>
                            )}
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
                                { currentPortfolio && currentPortfolio.length > 0 ? (
                                    currentPortfolio.map((e,i) => (
                                        <div  className="photo-grid-photo">
                                            <img src={e.photo_link} key={e.photo_link} alt=""/>
                                        </div>
                                    ))
                                ) : (
                                    <p className="pa-3" style={{ textAlign: 'center' }}>There are no photos to show in this portfolio.</p>
                                )}
                            </div>
                        ) : (
                            <div className="pa-4">
                                <JobCalendar/>
                            </div>
                        ) }
                        </div>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, null)(Profile)