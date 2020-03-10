import React from "react";
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";
import { signIn } from "../../common/actions/auth";
import { connect } from "react-redux";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

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
                    ...values,
                }, history);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <React.Fragment>
                <h1>Sign In</h1>
                <Form>
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