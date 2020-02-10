import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";
import { Link } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Edit extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }
    state = {
        success: false,
        error: false
    }

    handleSubmit = e => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // const { username } = currentUser
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                const {
                    firstName,
                    lastName,
                    username,
                    email,
                    ssn,
                    bankAccountNumber,
                    bankName,
                    bankAccountName,
                    phone
                } = values;

                // TODO: connect to backend
                localStorage.setItem("currentUser", JSON.stringify({
                    ...currentUser,
                    firstName,
                    lastName,
                    username,
                    email,
                    ssn,
                    bankAccountNumber,
                    bankName,
                    bankAccountName,
                    phone
                }))
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
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const { 
            username, 
            firstName, 
            lastName, 
            email, 
            ssn,
            bankAccountNumber,
            bankName,
            bankAccountName,
            type,
            phone
        } = currentUser

        const { success, error } = this.state;

        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');
        const lastNameError = isFieldTouched('lastName') && getFieldError('lastName');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const phoneError = isFieldTouched('phone') && getFieldError('phone');
        const ssnError = isFieldTouched('ssn') && getFieldError('ssn');
        const bankNameError = isFieldTouched('bankName') && getFieldError('bankName');
        const bankAccountNumberError = isFieldTouched('bankAccountNumber') && getFieldError('bankAccountNumber');
        const bankAccountNameError = isFieldTouched('bankAccountName') && getFieldError('bankAccountName');

        return (
            <React.Fragment>
                <h1>Personal Information</h1>
                { success && 
                    <React.Fragment>
                        <div className="success-banner">
                            <span>Your personal information has been edited.</span>
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
                        <Link to="/user/edit/password">
                            <Button 
                                type="primary" 
                                className="mr-2"
                                htmlType="button" 
                            >Edit Password</Button>
                        </Link>
                    </Form.Item>
                    <h3>Contact Information</h3>
                    <label>Phone Number</label>
                    <Form.Item 
                        validateStatus={phoneError ? 'error' : ''} 
                        help={phoneError || ''}
                    >
                        {getFieldDecorator('phone', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                            ],
                            initialValue: phone
                        })(
                            <Input
                                placeholder="Phone Number"
                                type="phone"
                            />,
                        )}
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
                                maxLength={13}
                            />,
                        )}
                    </Form.Item>
                    { type === 'PHOTOGRAPHER' && (
                        <React.Fragment>
                            <h3>Payment Information</h3>
                            <div className="d-flex">
                                <div className="mr-1">
                                    <label>Bank Account Number</label>
                                    <Form.Item 
                                        validateStatus={bankAccountNumberError ? 'error' : ''} 
                                        help={bankAccountNumberError || ''}
                                    >
                                        {getFieldDecorator('bankAccountNumber', {
                                            rules: [
                                                { required: true,message: 'This field is required.' },
                                            ],
                                            initialValue: bankAccountNumber
                                        })(
                                            <Input
                                                placeholder="Account Number"
                                                type="text"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="ml-1">
                                    <label>Bank Name</label>
                                    <Form.Item 
                                        validateStatus={bankNameError ? 'error' : ''} 
                                        help={bankNameError || ''}
                                    >
                                        {getFieldDecorator('bankName', {
                                            rules: [
                                                { required: true,message: 'This field is required.' },
                                            ],
                                            initialValue: bankName
                                        })(
                                            <Input
                                                placeholder="Bank Name"
                                                type="text"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="mr-1">
                                <label>Bank Account Name</label>
                                <Form.Item 
                                    validateStatus={bankAccountNameError ? 'error' : ''} 
                                    help={bankAccountNameError || ''}
                                >
                                    {getFieldDecorator('bankAccountName', {
                                        rules: [
                                            { required: true,message: 'This field is required.' },
                                        ],
                                        initialValue: bankAccountName
                                    })(
                                        <Input
                                            placeholder="Account Number"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                            </div>
                        </React.Fragment>
                    )}
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
                                onClick={() => {
                                    type === 'PHOTOGRAPHER' ? history.push("/profile/" + username)
                                    : history.push("/")
                                }}
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