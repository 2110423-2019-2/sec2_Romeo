import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Tag, Icon, Divider } from "antd";
import { connect } from "react-redux"
import { getCurrentClientInfo } from "common/auth";
import { formatDateTime } from "common/date";
import JobCalendar from "./calendar";
import { styleColors } from "../../common/style-colors";
import Axios from "axios"
import SignInModal from "../signinreg/modal";

class Profile extends React.Component {
    state = {
        display: 0,
        currentPhotographer: null,
        currentPortfolio: null,
        currentClient: null,
        showSignIn: false,
        enableReserve: false
    }

    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        const { username } = this.props.match.params;
        const res =  await Axios.get("/api/photographers/" + username)
        const photographer = res.data;
        this.setState({
            photographer
        });
        const currentPortfolio = photographer.photographer_photos;
        this.setState({
            currentPhotographer: photographer,
            currentPortfolio,
            currentClient
        });
    }

    handleReserve = () => {
        console.log("reserve");
    }

    render() {
        const { 
            currentPhotographer, 
            currentPortfolio, 
            display, 
            currentClient, 
            showSignIn,
            enableReserve
        } = this.state;
        const { username } = this.props.match.params;
        if (currentPhotographer && (currentPhotographer.profile.username === username 
            && currentPhotographer.profile.user_type !== 1)) {
            return <Redirect to="/"/>
        }
        
        const { isAuth } = this.props;

        return (
            <div className="d-flex-md align-stretch bg-white">
                { currentPhotographer && (
                    <React.Fragment>
                        <div
                            className="sidebar-profile pa-3"
                        >
                            <h1 className="mb-1">
                                {currentPhotographer.profile.user.first_name} {currentPhotographer.profile.user.last_name}
                            </h1>
                            <h3 className="mb-2">{username}</h3>
                            <span className="t-color-light d-block">Last Online Time: {formatDateTime(currentPhotographer.photographer_last_online_time)}</span>
                            { (!isAuth || (currentClient && currentClient.profile.user.user_type !== 1)) && (
                                <Button type="danger" size="large" shape="round" ghost className="mt-2">
                                    Favorite <Icon type="heart" theme='outlined' />
                                </Button>
                            )} 
                            <Divider/>
                            <div className="mb-3">
                                <div className="secondary-label mb-2">
                                    Styles
                                </div>
                                { currentPhotographer.photographer_style.length > 0 ? (
                                    currentPhotographer.photographer_style.map((e,i) => (
                                        <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                            {e}
                                        </Tag>
                                    ))
                                ) : (
                                    <span className="t-color-light">There are no styles.</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="secondary-label mb-2">
                                    Equipment
                                </div>
                                { currentPhotographer.photographer_equipment.length > 0 ? (
                                    currentPhotographer.photographer_equipment.map((e,i) => (
                                        <div className="snippet secondary" key={i + e.equipment_name}>
                                            {e.equipment_name}
                                        </div>
                                    ))
                                ) : (
                                    <span className="t-color-light">There is no equipment.</span>
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
                                    onClick={() => this.setState({ display: 0, enableReserve: false})}
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
                                        <div className="photo-grid-photo" key={e.photo_link}>
                                            <img src={e.photo_link} alt=""/>
                                        </div>
                                    ))
                                ) : (
                                    <p className="pa-3" style={{ textAlign: 'center' }}>There are no photos to show in this portfolio.</p>
                                )}
                            </div>
                        ) : (
                            <div className="pa-4">
                                <JobCalendar 
                                    fullscreen={true} 
                                    currentPhotographer={currentPhotographer}
                                    currentClient={currentClient}
                                    enableReserve={enableReserve}
                                />
                            </div>
                        ) }
                        </div>
                        { currentClient && currentClient.profile.user.user_type !== 1 && (
                            <Button 
                                type={enableReserve ? "danger" : "primary"}
                                onClick={() => this.setState({ display: 1, enableReserve: !enableReserve })}
                                className="el-4 pos-fixed"
                                size="large"
                                shape="round"
                                style={{
                                    right: 36,
                                    bottom: 24,
                                    transform: 'scale(1.2)',
                                    zIndex: 999
                                }}
                            >
                                { enableReserve ? (
                                    <React.Fragment>
                                        <Icon type="close" /> Cancel
                                    </React.Fragment>
                                ): (
                                    <React.Fragment>
                                        <Icon type="book" /> Reserve
                                    </React.Fragment>
                                )}
                            </Button>
                        )}
                        { currentClient ? <div/> : 
                            <Button 
                                type="primary" 
                                onClick={() => this.setState({ showSignIn: true })}
                                className="el-4 pos-fixed"
                                size="large"
                                shape="round"
                                style={{
                                    right: 36,
                                    bottom: 24,
                                    transform: 'scale(1.2)',
                                    zIndex: 999
                                }}
                            >
                                <Icon type="book" /> Sign In to Reserve
                            </Button>
                        }
                        <SignInModal 
                            onCancel={() => this.setState({ showSignIn: false })} 
                            visible={showSignIn} 
                        />
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