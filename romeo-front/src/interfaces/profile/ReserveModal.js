import React from "react";
import { Button, Form, Input, Modal, DatePicker,
Dropdown, Radio, Icon } from "antd";
import { formatDashedDate, formatDate } from "common/date";
import { timeLabels } from "logic/Calendar"
import moment from "moment";
import Axios from "axios";
import history from "common/router/history";
import { styleLabels } from "logic/Styles";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ReserveModal extends React.Component {
    state = {
        times: [],
        jobStartDate: moment(new Date()),
        jobEndDate: moment(new Date()),
        selectedJobEndDate: moment(new Date()),
        dateError: false,
        style: ""
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
            this.setState({ selectedJobEndDate: formatDashedDate(date)});
            this.setState({ dateError: false });
        }
    }
    handleReserve = () => {
        const { jobStartDate, selectedJobEndDate, times, style } = this.state;
        const { currentClient, currentPhotographer} = this.props;
        if ( currentPhotographer.photographer_style.length > 0 ) {
            if (!style || style === "") {
                this.setState({
                    styleError: true
                });
                return;
            }
        } else {
            this.setState({ style: "NONE" })
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    jobTitle,
                    jobDescription,
                    jobLocation,
                    jobSpecialReq
                } = values;
                const req = {
                    job_customer: currentClient.profile.user.username,
                    job_photographer: currentPhotographer.profile.user.username,
                    job_reservation: times,
                    job_title: jobTitle,
                    job_location: jobLocation,
                    job_style: style === "" ? "NONE" : style,
                    job_description: jobDescription ? jobDescription : "",
                    job_status: "PENDING",
                    job_start_date: jobStartDate,
                    job_expected_complete_date: selectedJobEndDate,
                    job_special_requirement: jobSpecialReq ? jobDescription : "",
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
                job_avail_time: selectedTimes[k],
                photoshoot_date: formatDashedDate(k),
                photoshoot_time: selectedTimes[k].avail_time
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
            out += e.job_avail_time.photographer_price
        });
        return out;
    }
    render() {
        const { visible, onCancel, currentClient, currentPhotographer} = this.props;
        const { times, dateError, style, styleError } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Validation
        const jobTitleError = isFieldTouched('jobTitle') && getFieldError('jobTitle');
        const jobLocationError = isFieldTouched('jobLocation') && getFieldError('jobLocation');
        const jobEndDateError = isFieldTouched('jobEndDate') && getFieldError('jobEndDate');

        return (
            <Modal
                title="Reserve"
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
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
                        <label>Job Location</label>
                        <Form.Item 
                            validateStatus={jobLocationError ? 'error' : ''} help={jobLocationError || ''}
                            className="mb-2"
                        >
                            {getFieldDecorator('jobLocation', {
                                rules: [
                                    { required: true,message: 'This field is required.' },
                                ],
                            })(
                                <Input
                                    placeholder="Job Location"
                                    type="text"
                                />,
                            )}
                        </Form.Item>
                        { currentPhotographer.photographer_style.length > 0 && (
                            <React.Fragment>
                                <label>Job Style</label><br/>
                                <b className="d-block mb-1">
                                    Selected Style:{' '}
                                    {(style && style !== "") ? styleLabels[style] : "None"}
                                </b>
                                <Dropdown overlay={() => (
                                    <Form className="pa-3">
                                        <Radio.Group 
                                            value={style}
                                            onChange={e => this.setState({ style: e.target.value })} 
                                            className="vertical"
                                        >
                                            { currentPhotographer.photographer_style.map((e,i) => (
                                                <Radio 
                                                    value={e} 
                                                    key={e+i} 
                                                    style={{display: 'block'}}
                                                >{styleLabels[e]}</Radio>
                                            )) }
                                        </Radio.Group>
                                    </Form>
                                    )} 
                                    trigger={['click']}
                                >
                                    <Button type="primary">
                                        <span>Select One</span>
                                        <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </React.Fragment>
                        )}
                        <div className="pb-3"/>
                        <label>Job Description</label>
                        <Form.Item className="mt-1">
                            {getFieldDecorator('jobDescription')(
                                <Input.TextArea
                                    placeholder="Job Description"
                                    type="text"
                                />
                            )}
                        </Form.Item>
                        <label>Special Requirements</label>
                        <Form.Item className="mt-1">
                            {getFieldDecorator('jobSpecialReq')(
                                <Input
                                    placeholder="Special Requirements"
                                    type="text"
                                />
                            )}
                        </Form.Item>
                        <label className="mb-2 d-block">Job Time(s)</label>
                        { times.map((e,i) => (
                            <div className="snippet d-flex justify-space-between" key={i + e.photoshoot_date}>
                                <div>
                                    {formatDate(e.photoshoot_date)} ({e.job_avail_time.avail_date}),{' '} 
                                    {timeLabels[e.job_avail_time.avail_time]}
                                </div>
                                <div><b>Price: {e.job_avail_time.photographer_price}THB</b></div>
                            </div>
                        ))}
                        <div className="pb-3"/>
                        <label className="pb-3 d-block">
                            Job Start Date: <b>{formatDate(this.state.jobStartDate)}</b>
                        </label>
                        <label>Job Expected Complete Date</label>
                        <Form.Item
                            validateStatus={(jobEndDateError || dateError) ? 'error' : ''} 
                            help={dateError ? "Job's end date cannot be before the last day of the job." : (jobEndDateError || '')}
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
                        <div className="pb-3"/>
                        { (styleError && style === "") && (
                            <div className="error-banner">
                                <b>Please select a style.</b>
                            </div>
                        ) }
                        <Form.Item className="mb-0">
                            <Button 
                                type="primary" 
                                onClick={e => this.handleReserve(e)}
                                className="mr-2"
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError()) || dateError}
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