import React from 'react';
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { Redirect } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'
import history from "common/router/history";
import { getCurrentClient, editCurrentClient } from "logic/Client";
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
    componentDidMount() {
        // TODO: Connect to backend
        const currentClient = getCurrentClient();
        const { equipment, styles, availTimes } = currentClient;
        const { setCurrentEquipment, setCurrentStyles, setCurrentAvailTimes} = this.props;
        setCurrentEquipment(equipment ? equipment : []);
        setCurrentStyles(styles ? styles : []);
        setCurrentAvailTimes(availTimes ? availTimes : defaultAvailTimes);
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
            styles: currentStyles,
            availTimes: currentAvailTimes,
            price: this.props.form.getFieldsValue().price
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

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const priceError = isFieldTouched('price') && getFieldError('price');

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
                <h3>Pricing</h3>
                    <label>Full-day Price</label>
                    <Form.Item 
                        validateStatus={priceError ? 'error' : ''} 
                        help={priceError || ''}
                    >
                        {getFieldDecorator('price', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                            initialValue: currentClient.price
                        })(
                            <Input
                                placeholder="Full-day Price"
                                type="price"
                            />,
                        )}
                    </Form.Item>
                </div>
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

