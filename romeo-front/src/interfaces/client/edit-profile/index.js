import React from 'react';
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'
import history from "common/router/history";
import { getCurrentClient, editCurrentClient } from "logic/Client";
import { setCurrentEquipment, setCurrentStyles, setCurrentAvailTimes } from "./actions";
import Equipment from "./equipment";
import Style from "./style";
import AvailTimes from "./availTimes";

class EditProfile extends React.Component {
    componentDidMount() {
        // TODO: Connect to backend
        const currentClient = getCurrentClient();
        const { equipment, styles, availTimes } = currentClient;
        const { setCurrentEquipment, setCurrentStyles, setCurrentAvailTimes} = this.props;
        setCurrentEquipment(equipment ? equipment : []);
        setCurrentStyles(styles ? styles : []);
        setCurrentAvailTimes(availTimes ? availTimes : []);
    }
    state = {
        success: false,
        error: false,
    }

    handleSubmit = e => {
        e.preventDefault();
        const currentClient = getCurrentClient();
                
        const {
            currentEquipment,
            currentStyles,
            currentAvailTimes
        } = this.props;

        // TODO: connect to backend
        editCurrentClient({
            ...currentClient,
            equipment: currentEquipment,
            styles: currentStyles
        })
        scroll.scrollToTop();
        this.setState({ success: true })
        this.setState({ error: false })
};

    render() {
        const currentClient = getCurrentClient();
        if (currentClient.type !== "PHOTOGRAPHER") {
            return <Redirect to="/"/>
        }

        const { 
            success, 
            error
        } = this.state;

        return (
            <div className="container mt-4 with-sidebar pl-4">
                <h1>Edit Profile</h1>
                { success && 
                    <React.Fragment>
                        <div className="success-banner">
                            <span>Your profile has been updated.</span>
                        </div>
                        <div className="pb-2"/>
                    </React.Fragment>
                }
                { error && 
                    <React.Fragment>
                        <div className="error-banner">
                            <span>An error occurred. Please try again later.</span>
                        </div>
                        <div className="pb-2"/>
                    </React.Fragment>
                }
                <div className="mb-4">
                    <AvailTimes />
                </div>
                <div>
                    <Row gutter={{ xs: 0, sm: 32 }}>
                        <Col xs={{ span:24 }} lg={{ span: 12 }} className="mb-4">
                            <Equipment />
                        </Col>
                        <Col xs={{ span:24 }} lg={{ span: 12}} className="mb-4">
                            <Style />
                        </Col>
                    </Row>
                    <div className="d-flex">
                        <Button 
                            type="primary" 
                            onClick={e => this.handleSubmit(e)}
                            className="mr-2"
                            htmlType="submit" 
                        >Confirm Edits</Button>
                        <Button 
                            type="secondary" 
                            onClick={() => history.goBack()}
                            className="mr-2"
                            htmlType="button" 
                        >Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentEquipment: state.editProfile.currentEquipment,
    currentStyles: state.editProfile.currentStyles,
    currentAvailTimes: state.editProfile.currentAvailTimes
})
const mapDispatchToProps = {
    setCurrentEquipment,
    setCurrentStyles,
    setCurrentAvailTimes
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfile);