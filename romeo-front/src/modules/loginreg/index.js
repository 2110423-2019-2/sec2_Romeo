import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";
import { logIn } from "../../common/actions/auth";
import { connect } from "react-redux";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { email, password } = values
                this.props.logIn({ id:email, password }, history);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        return (
            <div class="container mt-4">
                <h1>Login</h1>
                <Form>
                    <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                        {getFieldDecorator('email', {
                            rules: [
                                { required: true,message: 'This field is required.' },
                                { email: true,message: 'Must enter a vaid email.' },
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
                    <Form.Item>
                        <Button 
                            type="primary" 
                            onClick={e => this.handleSubmit(e)}
                            className="mr-2"
                            htmlType="submit" 
                            disabled={hasErrors(getFieldsError())}
                        >Login</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const WrappedLoginForm = Form.create({ name: 'login' })(Login);

export default connect(
	null,
	{ logIn }
)(WrappedLoginForm);