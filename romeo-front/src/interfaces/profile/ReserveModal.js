import React from "react";
import { Button, Form, Input, Modal, DatePicker } from "antd";
import Calendar from "./calendar";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ReserveModal extends React.Component {
    componentDidMount() {
        
    }
    handleReserve = () => {

    }
    onDateChange = (date, dateString) => {

    }
    isAvailable = (date) => {
        const { currentPhotographer } = this.props;
        const { photographer_avail_time } = currentPhotographer;

    }
    render() {
        const { visible, onCancel, currentClient, currentPhotographer} = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const jobTitleError = isFieldTouched('jobTitle') && getFieldError('jobTitle');
        return (
            <Modal
                title="Reserve"
                visible={visible}
                onCancel={onCancel}
                currentClient={currentClient}
                currentPhotographer={currentPhotographer}
                footer={null}
            >
                { currentClient && (
                    <Form>
                        <label>Job Title</label>
                        <Form.Item 
                            validateStatus={jobTitleError ? 'error' : ''} help={jobTitleError || ''}
                            className="mb-2"
                        >
                            {getFieldDecorator('jobTitle', {
                                rules: [
                                    { required: true,message: 'This field is required.' },
                                ],
                            })(
                                <Input
                                    placeholder="Job Title"
                                    type="text"
                                />,
                            )}
                        </Form.Item>
                        <label>Job Description</label>
                        <Form.Item className="mt-1">
                            <Input.TextArea
                                placeholder="Job Description"
                                type="text"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                type="primary" 
                                onClick={e => this.handleReserve(e)}
                                className="mr-2"
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError())}
                            >Reserve</Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        )
    }
}

const WrappedReserveForm = Form.create({ name: 'reserve' })(ReserveModal);

export default WrappedReserveForm;