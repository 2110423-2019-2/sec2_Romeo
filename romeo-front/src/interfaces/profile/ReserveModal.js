import React from "react";
import { Button, Form, Input, Modal, DatePicker } from "antd";
import { formatDashedDate, formatDate } from "common/date";
import { timeLabels } from "logic/Calendar"
import moment from "moment";
import Axios from "axios";
import history from "common/router/history";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ReserveModal extends React.Component {
    state = {
        times: [],
        jobStartDate: moment(new Date()),
        jobEndDate: moment(new Date()),
        dateError: false
    }
    componentDidMount() {
        this.props.form.validateFields();
        this.mapSelectedTimes();
    }
    onJobEndChange = (date) => {
        const { jobEndDate } = this.state;
        if (moment(date).isBefore(moment(jobEndDate))) {
            this.setState({ dateError: true })
        } else {
            this.setState({ jobEndDate: formatDashedDate(date)});
            this.setState({ dateError: false });
        }
    }
    handleReserve = () => {
        const { jobStartDate, jobEndDate, times } = this.state;
        const { currentClient, currentPhotographer} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    jobTitle,
                    jobDescription
                } = values;
                const req = {
                    job_customer: currentClient.profile.user.username,
                    job_photographer: currentPhotographer.profile.user.username,
                    job_reservation: times,
                    job_title: jobTitle,
                    job_description: jobDescription,
                    job_status: "PENDING",
                    job_start_date: jobStartDate,
                    job_end_date: jobEndDate,
                    job_total_price: -1,
                    job_url: null
                }
                Axios.post("/api/jobs/", req).then(res => {
                    history.push("/client/reservations/")
                }).catch(err => console.log(err));
            }
        });
    }
    mapSelectedTimes = () => {
        const { selectedTimes } = this.props;
        let out = [];
        Object.keys(selectedTimes).forEach(k => {
            out.push({
                job_reservation: selectedTimes[k],
                photoshoot_date: formatDashedDate(k)
            })
        });
        // Calculate Job Start/End Date
        if (out.length > 0) {
            out = out.sort((a,b) => moment(a.photoshoot_date) - moment(b.photoshoot_date));
            this.setState({
                times: out,
                jobStartDate: out[0].photoshoot_date,
                jobEndDate: out[out.length-1].photoshoot_date
            })
        }
    }
    calculateTotalPrice = () => {
        let out = 0;
        this.state.times.forEach(e => {
            out += e.job_reservation.photographer_price
        });
        return out;
    }
    render() {
        const { visible, onCancel, currentClient, currentPhotographer} = this.props;
        const { times, dateError } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const jobTitleError = isFieldTouched('jobTitle') && getFieldError('jobTitle');
        const jobEndDateError = isFieldTouched('jobEndDate') && getFieldError('jobEndDate');

        return (
            <Modal
                title="Reserve"
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
                { dateError && (
                    <React.Fragment>
                        <div className="error-banner">
                            <b>Job's end date cannot be before the last day of the job.</b>
                        </div>
                        <div className="pb-3"/>
                    </React.Fragment>
                ) }
                { currentPhotographer && (
                    <div className="mb-3">
                        <b>Photographer's Name: {currentPhotographer.profile.user.first_name} {currentPhotographer.profile.user.last_name}</b>
                    </div>
                )}
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
                                name="jobDescription"
                                placeholder="Job Description"
                                type="text"
                            />
                        </Form.Item>
                        <label className="mb-2 d-block">Job Time(s)</label>
                        { times.map((e,i) => (
                            <div className="snippet d-flex justify-space-between" key={i + e.photoshoot_date}>
                                <div>
                                    {formatDate(e.photoshoot_date)} ({e.job_reservation.avail_date}),{' '} 
                                    {timeLabels[e.job_reservation.avail_time]}
                                </div>
                                <div><b>Price: {e.job_reservation.photographer_price}THB</b></div>
                            </div>
                        ))}
                        <div className="pb-3"/>
                        <label className="pb-3 d-block">
                            Job Start Date: <b>{formatDate(this.state.jobStartDate)}</b>
                        </label>
                        <label>Job End Date</label>
                        <Form.Item
                            validateStatus={jobEndDateError ? 'error' : ''} help={jobEndDateError || ''}
                        >
                            {getFieldDecorator('jobEndDate', {
                                rules: [
                                    { required: true, message: 'This field is required.' },
                                ],
                            })(
                                <DatePicker 
                                    onChange={this.onJobEndChange} 
                                    format="D/M/YYYY"
                                />
                            )}
                        </Form.Item>
                        <h3 className="mb-2 t-color-primary">Total Price: {this.calculateTotalPrice()}THB</h3>
                        {/* Round to 2 decimal places */}
                        <h4 className="mb-2 t-color-light">Deposit: {Math.round(((this.calculateTotalPrice() * 30/100) *100) /100 )}THB</h4>
                        <small>You will not have to pay until the photographer accepts your reservation.</small>
                        <div className="pb-4"/>
                        <Form.Item>
                            <Button 
                                type="primary" 
                                onClick={e => this.handleReserve(e)}
                                className="mr-2"
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError())}
                            >Confirm Reservation</Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        )
    }
}

const WrappedReserveForm = Form.create({ name: 'reserve' })(ReserveModal);

export default WrappedReserveForm;