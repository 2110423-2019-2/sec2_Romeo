import React from "react";
import history from "../../common/router/history";
import { Button, Form, Input, Select } from "antd";
import { signIn } from "../../common/actions/auth";
import { connect } from "react-redux";
import { mockValues } from "logic/Client";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option } = Select;

class SignIn extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.signIn({
                    ...mockValues(),
                    ...values,
                }, history);
                // The mock data will not be actually needed to sign in.
                // After signing in, the user's data will be pulled from the database instead.
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const typeError = isFieldTouched('type') && getFieldError('type');
        return (
            <React.Fragment>
                <h1>Sign In</h1>
                <Form>
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
                    <Form.Item>
                        <Button 
                            type="primary" 
                            onClick={e => this.handleSubmit(e)}
                            className="mr-2"
                            htmlType="submit" 
                            disabled={hasErrors(getFieldsError())}
                        >Sign In</Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }
}

const WrappedSignInForm = Form.create({ name: 'signIn' })(SignIn);

export default connect(
	null,
	{ signIn }
)(WrappedSignInForm);