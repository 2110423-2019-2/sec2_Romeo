import React from "react";
import history from "../../common/router/history";
import { Button, Form, Input, Select, Row, Col } from "antd";
import { signIn } from "../../common/actions/auth";
import { connect } from "react-redux";
import image from "assets/signup.jpg";
import Axios from "axios";
import moment from "moment";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option } = Select;

class SignUp extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    signInUser = (res) => {
        const user = res[0].profile;
        this.props.signIn({
            username: user.username,
            password: user.password,
        }, history);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { username, 
                    firstName, 
                    lastName, 
                    password, 
                    type,
                    email,
                    phone,
                    ssn,
                    bankName,
                    bankAccountNumber,
                    bankAccountName,
                } = values
                const userInfo = {
                    user: {
                        last_login: moment(new Date()),
                        is_superuser: false,
                        is_staff: false,
                        is_active: false,
                        date_joined: moment(new Date()),
                        user_type: type,
                        first_name: firstName,
                        last_name: lastName,
                        username,
                        password,
                        email,
                        groups: [],
                        user_permissions: [],
                    },
                }
                const profile = {
                    ...userInfo,
                    ssn,
                    bank_account_number: bankAccountNumber,
                    bank_name: bankName,
                    bank_account_name: bankAccountName,
                    phone,
                }
                const photographerInfo = {
                    photographer_last_online_time: moment(new Date()),
                    photographer_avail_time: [],
                    photographer_equipment: [],
                    photographer_photos: [],
                    photographer_style: []
                }
                if (type === 1) {
                    Axios.post('/api/photographers/',{
                        profile,
                        ...photographerInfo
                    }).then(res => {
                        this.signInUser(res);
                    })
                    .catch(err => console.log(err))
                } else {
                    Axios.post('/api/customers/',{
                        profile
                    })
                    .then(res => {
                        this.signInUser(res);
                    })
                    .catch(err => console.log(err))
                }
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');
        const lastNameError = isFieldTouched('lastName') && getFieldError('lastName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const typeError = isFieldTouched('type') && getFieldError('type');
        const phoneError = isFieldTouched('phone') && getFieldError('phone');
        const ssnError = isFieldTouched('ssn') && getFieldError('ssn');
        const bankNameError = isFieldTouched('bankName') && getFieldError('bankName');
        const bankAccountNumberError = isFieldTouched('bankAccountNumber') && getFieldError('bankAccountNumber');
        const bankAccountNameError = isFieldTouched('bankAccountName') && getFieldError('bankAccountName');

        return (
            <div className="full-width">
                <Row gutter={0}>
                    <Col xs={{ span:24 }} sm={{ span: 12}} className="mb-4 d-flex d-none-sm"
                    style={{ 
                        backgroundImage: `url(${image})`, 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100vh',
                        position: 'fixed',
                        top: 0,
                        bottom: 0
                    }}>
                    </Col>
                    <Col xs={{ span:24 }} sm={{ span: 12}} className="mb-4" style={{ float: 'right' }}>
                        <div className="pa-4">
                            <h1>Sign Up</h1>
                            <Form>
                                <h3>Account Information</h3>
                                <label>Username</label>
                                <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            { required: true,message: 'This field is required.' },
                                        ],
                                    })(
                                        <Input
                                            placeholder="Username"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                                <label>Email</label>
                                <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            { required: true,message: 'This field is required.' },
                                        ],
                                    })(
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                        />,
                                    )}
                                </Form.Item>
                                <label>Password</label>
                                <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'This field is required.' }],
                                    })(
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                        />,
                                    )}
                                </Form.Item>
                                <label>Type</label>
                                <Form.Item validateStatus={typeError ? 'error' : ''} help={typeError || ''}>
                                    {getFieldDecorator('type',{rules: [{ required: true , message: 'This field is required.'}]})(
                                        <Select placeholder="Type">
                                            <Option value={1}>Photographer</Option>
                                            <Option value={2}>Customer</Option>
                                        </Select>
                                    )}
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
                                        ]
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
                                        <Form.Item validateStatus={firstNameError ? 'error' : ''} help={firstNameError || ''}>
                                            {getFieldDecorator('firstName', {
                                                rules: [
                                                    { required: true,message: 'This field is required.' },
                                                ],
                                            })(
                                                <Input
                                                    placeholder="First Name"
                                                    type="text"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="mr-1 full-width">
                                        <label>Last Name</label>
                                        <Form.Item validateStatus={lastNameError ? 'error' : ''} help={lastNameError || ''}>
                                            {getFieldDecorator('lastName', {
                                                rules: [
                                                    { required: true,message: 'This field is required.' },
                                                ],
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
                                <Form.Item validateStatus={ssnError ? 'error' : ''} help={ssnError || ''}>
                                    {getFieldDecorator('ssn', {
                                        rules: [
                                            { required: true,message: 'This field is required.' },
                                        ],
                                    })(
                                        <Input
                                            placeholder="Social Security Number"
                                            type="text"
                                            maxLength="13"
                                        />,
                                    )}
                                </Form.Item>
                                <h3>Payment Information</h3>
                                <div className="d-flex">
                                    <div className="mr-1 full-width">
                                        <label>Bank Account Number</label>
                                        <Form.Item 
                                            validateStatus={bankAccountNumberError ? 'error' : ''} 
                                            help={bankAccountNumberError || ''}
                                            className="full-width"
                                        >
                                            {getFieldDecorator('bankAccountNumber', {
                                                rules: [
                                                    { required: true,message: 'This field is required.' },
                                                ]
                                            })(
                                                <Input
                                                    placeholder="Account Number"
                                                    type="text"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="ml-1 full-width">
                                        <label>Bank Name</label>
                                        <Form.Item 
                                            validateStatus={bankNameError ? 'error' : ''} 
                                            help={bankNameError || ''}
                                            className="full-width"
                                        >
                                            {getFieldDecorator('bankName', {
                                                rules: [
                                                    { required: true,message: 'This field is required.' },
                                                ]
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
                                            ]
                                        })(
                                            <Input
                                                placeholder="Account Name"
                                                type="text"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        onClick={e => this.handleSubmit(e)}
                                        className="mr-2"
                                        htmlType="submit" 
                                        disabled={hasErrors(getFieldsError())}
                                    >Sign Up</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const WrappedSignUpForm = Form.create({ name: 'signIn' })(SignUp);

export default connect(
	null,
	{ signIn }
)(WrappedSignUpForm);