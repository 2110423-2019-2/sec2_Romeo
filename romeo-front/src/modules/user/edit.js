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
        const username = localStorage.getItem("username");
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                history.push("/profile/" + username);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const username = localStorage.getItem("username");

        // Validation
        const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');

        return (
            <div class="container mt-4">
                <h1>Edit Profile</h1>
                <p>Username: {username}</p>
                <Form>
                    <Form.Item validateStatus={firstNameError ? 'error' : ''} help={firstNameError || ''}>
                        {getFieldDecorator('firstName', {
                            rules: [{ required: true, message: 'This field is required.' }],
                        })(
                            <Input
                                placeholder="First Name"
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
                        >Confirm</Button>
                        <Button 
                            type="secondary" 
                            onClick={() => history.push("/profile/" + username)}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const WrappedEditForm = Form.create({ name: 'edit_profile' })(Edit);

export default WrappedEditForm;