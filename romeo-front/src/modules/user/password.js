import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Edit extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { password } = currentUser

        this.props.form.validateFields((err, values) => {
            if ( values.oldPassword !== password) {
                this.setState({
                    wrongPassword: true
                })
                return;
            } else {
                this.setState({
                    wrongPassword: false
                })
            }
            if ( values.newPassword !== values.confirmPassword) {
                this.setState({
                    passwordsDoNotMatch: true
                })
                return;
            } else {
                this.setState({
                    passwordsDoNotMatch: false
                })
            }
            if (!err) {
                console.log('Received values of form: ', values);
                
                // TODO: connect to backend
                localStorage.setItem("currentUser", JSON.stringify({
                    ...currentUser,
                    password: values.newPassword
                }));
                this.setState({
                    success: true
                })
            }
        });
    };

    state = {
        passwordsDoNotMatch: false,
        wrongPassword: false,
        success: false
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { passwordsDoNotMatch, wrongPassword, success } = this.state;

        // Validation
        const oldPasswordError = isFieldTouched('oldPassword') && getFieldError('oldPassword');
        const newPasswordError = isFieldTouched('newPassword') && getFieldError('newPassword');
        const confirmPasswordError = isFieldTouched('confirmPassword') 
            && getFieldError('confirmPassword');

        return (
            <React.Fragment>
                <h1>Edit Password</h1>
                <div className="mb-4">
                    { passwordsDoNotMatch && (
                        <div className="error-banner">
                            <b className="t-color-error">Passwords Do Not Match</b>
                        </div>
                    ) }
                    { wrongPassword && (
                        <div className="error-banner">
                            <b>Incorrect Password</b>
                        </div>
                    ) }
                    { success && (
                        <div className="success-banner">
                            <b>Password has been edited.</b>
                        </div>
                    ) }
                </div>
                <Form>
                    <label>Old Password</label>
                    <Form.Item validateStatus={oldPasswordError ? 'error' : ''} help={oldPasswordError || ''}>
                        {getFieldDecorator('oldPassword', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                        })(
                            <Input
                                placeholder="Old Password"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <label>New Password</label>
                    <Form.Item validateStatus={newPasswordError ? 'error' : ''} help={newPasswordError || ''}>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                        })(
                            <Input
                                placeholder="New Password"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <label>Confirm New Password</label>
                    <Form.Item validateStatus={confirmPasswordError ? 'error' : ''} help={confirmPasswordError || ''}>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                        })(
                            <Input
                                placeholder="Confirm New Password"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div className="d-flex">
                            <Button 
                                type="primary" 
                                onClick={e => this.handleSubmit(e)}
                                className="mr-2"
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError())}
                            >Confirm Password Edit</Button>
                            <Button 
                                type="secondary" 
                                onClick={() => history.push("/user/edit")}
                                className="mr-2"
                                htmlType="button" 
                            >Back</Button>
                        </div>
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }
}

const WrappedEditForm = Form.create({ name: 'edit_profile' })(Edit);

export default WrappedEditForm;