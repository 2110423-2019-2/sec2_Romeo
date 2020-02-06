import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input, Select, Modal } from "antd";
import { signIn } from "../../common/actions/auth";
import { connect } from "react-redux";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option } = Select;

class SignInRegModal extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { username, password, type } = values
                this.props.signIn({ 
                    username, 
                    password, 
                    type 
                }, history);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { visible, show, handleCancel } = this.props;
        // Validation
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const typeError = isFieldTouched('type') && getFieldError('type');

        return (
            <Modal 
                visible={visible} 
                handleCancel={handleCancel}
                footer={null}
            >
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
                                type="username"
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
            </Modal>
        )
    }
}

const WrappedSignInForm = Form.create({ name: 'signIn' })(SignInRegModal);

export default connect(
	null,
	{ signIn }
)(WrappedSignInForm);