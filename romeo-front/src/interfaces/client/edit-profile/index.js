import React from 'react';
import { Button, Form, Input, Row, Col, Icon } from "antd";
import { Redirect } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'
import history from "common/router/history";
import { getCurrentClient, editCurrentClient } from "logic/Client";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class EditProfile extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
        // TODO: Connect to backend
        const currentClient = getCurrentClient();
        const { equipment, styles, availTimes } = currentClient;
        this.setState({
            currentEquipment: equipment ? equipment : [],
            currentStyles: styles ? styles : [],
            currentAvailTimes: availTimes ? availTimes : []
        })
    }
    state = {
        success: false,
        error: false,
        currentEquipment: [],
        currentStyles: [],
        currentAvailTimes: []
    }

    addEquipment = () => {
        const equipmentName = this.props.form.getFieldsValue().equipmentName;
        const { currentEquipment } = this.state;
        this.setState({
            currentEquipment: [...currentEquipment, equipmentName]
        });
    }
    deleteEquipment = key => {
        let { currentEquipment } = this.state;
        console.log(key);
        this.setState({
            currentEquipment: [
                ...currentEquipment.slice(0,key),
                ...currentEquipment.slice(key+1,currentEquipment.length)]
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        const currentClient = getCurrentClient();
        // const { username } = currentClient
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                const {
                    currentEquipment
                } = this.state;

                // TODO: connect to backend
                editCurrentClient({
                    ...currentClient,
                    equipment: currentEquipment
                })
                scroll.scrollToTop();
                this.setState({ success: true })
                this.setState({ error: false })
            } else {
                scroll.scrollToTop();
                this.setState({ error: true })
                this.setState({ success: false })
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));

        if (currentClient.type !== "PHOTOGRAPHER") {
            return <Redirect to="/"/>
        }

        const { 
            success, 
            error,
            currentEquipment,
            currentStyles,
            currentAvailTimes
        } = this.state;

        // Validation
        const equipmentNameError = isFieldTouched('equipmentName') && getFieldError('equipmentName');

        return (
            <React.Fragment>
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
                <Form>
                    <Row className="mb-4">
                        <Col span={12}>
                            <h3>Equipment</h3>
                            <div className="d-flex">
                                <Form.Item 
                                    validateStatus={equipmentNameError ? 'error' : ''} 
                                    help={equipmentNameError || ''}
                                    className="mr-2 mb-0"
                                >
                                    {getFieldDecorator('equipmentName', {
                                        rules: [
                                            { required: true, message: 'This field is required.' },
                                        ],
                                    })(
                                        <Input
                                            placeholder="Equipment Name"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        onClick={(() => this.addEquipment())}
                                        className="mr-2"
                                        htmlType="submit" 
                                        disabled={getFieldsError().equipmentName}
                                    >
                                        <Icon type="plus" />
                                        Add Equipment
                                    </Button>
                                </Form.Item>
                            </div>
                            <h4>Current Equipment</h4>
                            { currentEquipment.length > 0 ? (
                                currentEquipment.map((e,i) => (
                                    <div 
                                        className="snippet"
                                        key={"equip" + i}
                                    >
                                        <b>{e}</b>
                                        <Button type="danger" onClick={() => this.deleteEquipment(i)}>
                                            <Icon type="delete"/>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="t-color-light">You haven't added any equipment.</p>
                            )}
                        </Col>
                        <Col span={12}>
                            <h3>Styles</h3>
                            <p>Checkboxes</p>
                        </Col>
                    </Row>
                    <Form.Item>
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
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }
}

const WrappedEditProfileForm = Form.create({ name: 'edit_profile' })(EditProfile);

export default WrappedEditProfileForm;