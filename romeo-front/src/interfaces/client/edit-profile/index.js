import React from 'react';
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { Redirect } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'
import history from "common/router/history";

import { getCurrentClient, getCurrentClientInfo } from "common/auth";
import { setCurrentEquipment, setCurrentStyles, setCurrentAvailTimes } from "./actions";

import Equipment from "./equipment";
import Style from "./style";
import AvailTimes from "./availTimes";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const defaultAvailTimes = [{
    day: "MONDAY",
    time: "NOT_AVAILABLE"
},{
    day: "TUESDAY",
    time: "NOT_AVAILABLE"
},{
    day: "WEDNESDAY",
    time: "NOT_AVAILABLE"
},{
    day: "THURSDAY",
    time: "NOT_AVAILABLE"
},{
    day: "FRIDAY",
    time: "NOT_AVAILABLE"
},{
    day: "SATURDAY",
    time: "NOT_AVAILABLE"
},{
    day: "SUNDAY",
    time: "NOT_AVAILABLE"
}]

class EditProfile extends React.Component {
    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        this.setState({
            currentClient
        });
    }
    state = {
        currentClient: null,
        success: false,
        error: false,
    }

    handleSubmit = e => {
        e.preventDefault();
                
        const {
            currentEquipment,
            currentStyles,
            currentAvailTimes
        } = this.props;

        // // TODO: connect to backend
        // editCurrentClient({
        //     ...currentClient,
        //     equipment: currentEquipment,
        //     styles: currentStyles,
        //     availTimes: currentAvailTimes,
        //     price: this.props.form.getFieldsValue().price
        // })
        scroll.scrollToTop();
        this.setState({ success: true })
        this.setState({ error: false })
};

    render() {

        if (getCurrentClient().type !== 1) {
            return <Redirect to="/"/>
        }

        const { 
            success, 
            error,
            currentClient
        } = this.state;

        const { getFieldsError } = this.props.form;

        return (
            <div className="container mt-4 with-sidebar pl-4">
                { currentClient && (
                    <React.Fragment>
                        '<h1>Edit Profile</h1>
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
                            <AvailTimes currentClient={currentClient}/>
                        </div>
                        <div>
                            <Row gutter={{ xs: 0, sm: 32 }}>
                                <Col xs={{ span:24 }} lg={{ span: 12 }} className="mb-4">
                                    {/* <Equipment currentClient={currentClient}/> */}
                                </Col>
                                <Col xs={{ span:24 }} lg={{ span: 12}} className="mb-4">
                                    {/* <Style currentClient={currentClient}/> */}
                                </Col>
                            </Row>
                            <div className="d-flex">
                                <Button 
                                    type="primary" 
                                    onClick={e => this.handleSubmit(e)}
                                    className="mr-2"
                                    htmlType="submit" 
                                    disabled={hasErrors(getFieldsError())}
                                >Confirm Edits</Button>
                                <Button 
                                    type="secondary" 
                                    onClick={() => history.goBack()}
                                    className="mr-2"
                                    htmlType="button" 
                                >Cancel</Button>
                            </div>
                        </div>      
                    </React.Fragment>
                )}
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
const WrappedForm = Form.create({ name: 'edit_profile' })(EditProfile);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedForm);

