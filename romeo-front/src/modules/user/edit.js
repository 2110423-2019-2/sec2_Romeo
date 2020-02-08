import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";
import { Link } from 'react-router-dom';

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
        // const { username } = currentUser
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                history.push("/user/display");

                // TODO: connect to backend
                localStorage.setItem("currentUser", JSON.stringify({
                    ...currentUser,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    username: values.username,
                    email: values.email,
                    ssn: values.ssn
                }))
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { username, firstName, lastName, email, ssn } = currentUser

        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');
        const lastNameError = isFieldTouched('lastName') && getFieldError('lastName');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const ssnError = isFieldTouched('ssn') && getFieldError('ssn');

        return (
            <React.Fragment>
                <h1>Edit Personal Information</h1>
                <Form>
                    <h3>Account Information</h3>
                    <label>Username</label>
                    <Form.Item 
                        validateStatus={usernameError ? 'error' : ''} 
                        help={usernameError || ''}
                    >
                        {getFieldDecorator('username', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                            initialValue: username
                        })(
                            <Input
                                placeholder="Username"
                                type="text"
                            />,
                        )}
                    </Form.Item>
                    <label>Email</label>
                    <Form.Item 
                        validateStatus={emailError ? 'error' : ''} 
                        help={emailError || ''}
                    >
                        {getFieldDecorator('email', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                            initialValue: email
                        })(
                            <Input
                                placeholder="Email"
                                type="email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Link to="/user/display/edit/password">
                            <Button 
                                type="primary" 
                                className="mr-2"
                                htmlType="button" 
                            >Edit Password</Button>
                        </Link>
                    </Form.Item>
                    <h3>Personal Information</h3>
                    <div className="d-flex">
                        <div className="mr-1 full-width">
                            <label>First Name</label>
                            <Form.Item 
                                validateStatus={firstNameError ? 'error' : ''} 
                                help={firstNameError || ''}
                                className="full-width"
                            >
                                {getFieldDecorator('firstName', {
                                    rules: [
                                        { required: true,message: 'This field is required.' },
                                    ],
                                    initialValue: firstName
                                })(
                                    <Input
                                        placeholder="First Name"
                                        type="text"
                                    />,
                                )}
                            </Form.Item>
                        </div>
                        <div className="ml-1 full-width">
                            <label>Last Name</label>    
                            <Form.Item 
                                validateStatus={lastNameError ? 'error' : ''} 
                                help={lastNameError || ''}
                                className="full-width"
                            >
                                {getFieldDecorator('lastName', {
                                    rules: [
                                        { required: true,message: 'This field is required.' },
                                    ],
                                    initialValue: lastName
                                })(
                                    <Input
                                        placeholder="Last Name"
                                        type="text"
                                    />,
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <label>Social Security Number</label>
                    <Form.Item 
                        validateStatus={ssnError ? 'error' : ''} 
                        help={ssnError || ''}
                    >
                        {getFieldDecorator('ssn', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                            initialValue: ssn
                        })(
                            <Input
                                placeholder="Social Security Number"
                                type="text"
                                maxLength="13"
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

const WrappedEditForm = Form.create({ name: 'edit_profile' })(Edit);

export default WrappedEditForm;