import React from "react";
import history from "../../common/router/history";
import { Button, Form, Input, Select } from "antd";
import { signIn } from "../../common/actions/auth";
import { connect } from "react-redux";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option } = Select;

class SignUp extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // const { username, email, password, type, name } = values
                // TODO: Connect with backend to register instead
                this.props.signIn(values, history);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const typeError = isFieldTouched('type') && getFieldError('type');
        const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');
        const lastNameError = isFieldTouched('lastName') && getFieldError('lastName');
        const ssnError = isFieldTouched('ssn') && getFieldError('ssn');
        console.log(this.props);
        return (
            <React.Fragment>
                <h1>Sign Up</h1>
                <Form>
                    <h3>Account Information</h3>
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
                    <Form.Item validateStatus={typeError ? 'error' : ''} help={typeError || ''}>
                        {getFieldDecorator('type',{rules: [{ required: true , message: 'This field is required.'}]})(
                            <Select placeholder="Type">
                                <Option value="PHOTOGRAPHER">Photographer</Option>
                                <Option value="CUSTOMER">Customer</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <h3>Personal Information</h3>
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
            </React.Fragment>
        )
    }
}

const WrappedSignUpForm = Form.create({ name: 'signIn' })(SignUp);

export default connect(
	null,
	{ signIn }
)(WrappedSignUpForm);