import React from "react"
import { Input, Table, Button, Modal, Dropdown, Menu, Form, Icon } from "antd";
import { Link } from "react-router-dom";
import CheckoutCreditCard from "../../omise/Checkout";
import { formatDate } from "common/date";
import { getCurrentClient } from "common/auth";
import moment from "moment";
import Axios from "axios";
import { 
    statusLabels,
    proceed,
    cancel,
    decline,
    createCreditCardCharge
} from "logic/Reservation"
import {
    timeLabels
} from "logic/Calendar";

const { confirm } = Modal;

export const calculateTotalPrice = (job_reservation) => {
    let out = 0;
    job_reservation.forEach(e => out += e.job_avail_time.photographer_price);
    return out
}

export const calculateLeftoverPrice = (job_reservation) => {
    let out = 0;
    job_reservation.forEach(e => out += e.job_avail_time.photographer_price);
    out = ((out * 70/100)*100)/100
    return out
}

export const calculateDepositPrice = (job_reservation) => {
    let out = 0;
    job_reservation.forEach(e => out += e.job_avail_time.photographer_price);
    out = ((out * 30/100)*100)/100
    return out
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Reservations extends React.Component {
    async componentDidMount() {
        const res = await Axios.get("/api/getjobs?search=" + getCurrentClient().username);
        this.setState({
            reservations: res.data,
        });
    }
    state = {
        reservations: [],
        payAmount: 0,
        link: "",
        showURLModal: false,
        showConfirmModal: false,
        selectedJob: null
    }

    handleLinkSubmit = () => {
        const { link, selectedJob } = this.state;
        proceed(selectedJob, 1, link)
    }
    
    showDeleteConfirm = (record, userType) => {
        const paid = record.job_status === "PAID";
        let content = "";
        if (paid) {
            content = userType === 2 ? "Your paid deposit will not be refunded." : "The deposit will be refunded to the customer"
        } else {
            content = "You will need to make a reservation again if you change your mind."
        }
        confirm({
          title: 'Are you sure cancel',
          content,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            cancel(record, userType)
          }
        });
    }
    render() {
        const { reservations, selectedJob, showConfirmModal } = this.state;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const linkError = isFieldTouched('link') && getFieldError('link');

        const columns = [{
            title: 'Title',
            dataIndex: 'job_title',
            key: 'job_title'
        },{
            title: (getCurrentClient() && getCurrentClient().type === 1) ? "Customer" : "Photographer",
            dataIndex: 'job_photographer',
            key: "user",
            render: (user, record) => {
                if (getCurrentClient() && getCurrentClient().type === 1) {
                    return <b>{record.job_customer.profile.user.username}</b>
                }
                return <b>{user.profile.user.username}</b>
            }
        },{
            title: 'Reservation Times',
            dataIndex: 'job_reservation',
            key: 'job_reservation',
            render: data => {
                return (
                    <Dropdown overlay={() => (
                        <Menu>
                            {data.map((e,i) => (
                                <Menu.Item key={e.photoshoot_date} style={{ pointerEvents: 'none' }}>
                                    <span><b>{formatDate(e.photoshoot_date)}</b>{' '}
                                    {timeLabels[e.job_avail_time.avail_time]}</span>
                                </Menu.Item>
                            ))}
                        </Menu>
                        )} trigger={['click']}>
                        <Button shape="round">See Times</Button>
                    </Dropdown>
                )
            }
        },{
            title: 'Total Price',
            dataIndex: 'job_reservation',
            key: 'job_reservation_1',
            render: (e) => {
                return <span>{calculateTotalPrice(e)}</span>
            }
        },{
            title: 'Status',
            dataIndex: 'job_status',
            key: 'job_status',
            render: status => {
                return <b>{status ? statusLabels[status] : "Closed"}</b>
            }
        },{
            title: '',
            dataIndex: 'job_status',
            key: 'job_actions',
            render: (status, record) => {
                return (
                    <div className="d-flex">
                        {record && renderActions(record)}
                    </div>
                )
            }
        },{
            title: 'More',
            dataIndex: 'job_id',
            key: 'job_id',
            render: (id) => {
                return (
                    <Link to={`/client/reservations/${id}`}>
                        <Button shape="round">
                            Details
                            <Icon type="right"/>
                        </Button>
                    </Link>
                )
            }
        },]
        
        const renderActions = (record) => {
            if (getCurrentClient().type === 1) {
                // Photographer Side
                switch (record.job_status) {
                    case "PENDING": return (
                        <React.Fragment>
                            <Button 
                                onClick={() => proceed(record, 1, null)} 
                                type="primary" 
                                className="ma-1"
                                shape="round"
                            >Accept</Button>
                            <Button 
                                onClick={() => decline(record, 1)} 
                                type="danger" 
                                className="ma-1"
                                shape="round"
                            >Decline</Button>
                        </React.Fragment>
                    );
                    case "DECLINED": return (<span/>);
                    case "CANCELLED": return (<span/>);
                    case "MATCHED": return (
                        <Button 
                            onClick={() => this.showDeleteConfirm(record, 1)}
                            type="danger"
                            shape="round"
                        >
                            Cancel
                        </Button>
                    );
                    case "PAID": return (
                        <React.Fragment>
                            <Button 
                                onClick={() => proceed(record,1,null)}
                                shape="round"
                                type="primary"
                                className="ma-1"
                            >
                                Start Processing Photos
                            </Button>
                            { moment(record.job_start_date).subtract(1, 'days').isBefore(new Date()) && (
                                <Button 
                                    onClick={() => this.showDeleteConfirm(record, 1)}
                                    type="danger"
                                    shape="round"
                                    className="ma-1"
                                >
                                    Cancel
                                </Button>
                            )}
                        </React.Fragment>
                    );
                    case "PROCESSING": return (
                        <Button 
                            onClick={() => this.setState({ 
                                showURLModal: true,
                                selectedJob: record
                            })}
                            shape="round"
                            type="primary"
                        >
                            Add Photos Storage URL
                        </Button>
                    );
                    case "COMPLETED": return (
                        <Button 
                            onClick={() => this.setState({ 
                                showURLModal: true,
                                link: record.job_url,
                                selectedJob: record
                            })}
                            shape="round"
                            type="primary"
                        >
                            Change URL
                        </Button>
                    );
                    case "CLOSED": return (
                        <Button 
                            onClick={() => this.setState({ 
                                showURLModal: true,
                                link: record.job_url,
                                selectedJob: record
                            })}
                            shape="round"
                            type="primary"
                        >
                            Change URL
                        </Button>
                    );
                    default: return <span/>
                }
            } else {
                // Customer Side
                switch (record.job_status) {
                    case "PENDING": return (
                        <React.Fragment>
                            <Button 
                                onClick={() => this.showDeleteConfirm(record, 2)} 
                                type="danger" 
                                className="ma-1"
                                shape="round"
                            >Cancel</Button>
                        </React.Fragment>
                    );
                    case "DECLINED": return (<span/>);
                    case "CANCELLED": return (<span/>);
                    case "MATCHED": return (
                        <React.Fragment>
                            <CheckoutCreditCard
                                job={record}
                                amount={calculateDepositPrice(record.job_reservation)}
                                createCreditCardCharge={createCreditCardCharge}
                            />
                            <Button 
                                onClick={() => this.showDeleteConfirm(record, 2)}
                                type="danger" 
                                className="ma-1"
                                shape="round"
                            >Cancel</Button>
                        </React.Fragment>
                    );
                    case "PAID": return (
                        moment(record.job_start_date).subtract(1, 'days').isBefore(new Date()) ? (
                            <Button 
                                onClick={() => this.showDeleteConfirm(record, 2)}
                                type="danger"
                                shape="round"
                            >
                                Cancel
                            </Button>
                        ) : (
                            <span>You cannot cancel your job right now.</span>
                        )
                    );
                    case "PROCESSING": return (<span/>);
                    case "COMPLETED": return (
                        <CheckoutCreditCard
                            job={record}
                            amount={calculateLeftoverPrice(record.job_reservation)}
                            createCreditCardCharge={createCreditCardCharge}
                        />
                    );
                    case "CLOSED": return (
                        <a href={record.job_url} target="_blank">
                            <Button shape="round" type="primary">See Photos</Button>
                        </a>
                    );
                    default: return <span/>
                }
            }
        }

        return (
            <div className="container mt-4 pl-4 with-sidebar">
                <h1>My Reservations</h1>
                <div className="full-width">
                    { reservations.length >= 0 ? (
                        <Table dataSource={reservations} columns={columns} />
                    ) : <Table dataSource={[]} columns={columns} />}
                </div>
                <Modal
                    title="Edit Photos Storage URL"
                    visible={this.state.showURLModal}
                    footer={null}
                    onCancel={() => this.setState({ showURLModal: false })}
                >
                    <Form>
                        <b>URL</b><br/>
                        <small>Current URL: {selectedJob && selectedJob.job_url}</small>
                        <Form.Item 
                            validateStatus={linkError ? 'error' : ''} 
                            help={linkError || ''}
                        >
                            {getFieldDecorator('link', {
                                rules: [
                                    { required: true,message: 'This field is required.' },
                                ],
                            })(
                                <Input
                                    placeholder="Photos Storage URL (ex: https://www.example.com)"
                                    onChange={e => this.setState({ link: e.target.value })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className="mb-0">
                            <Button 
                                type="primary" 
                                onClick={() => this.handleLinkSubmit()}
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError())}
                            >Confirm Edits</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const WrappedReservations = Form.create({ name: 'reservation' })(Reservations);

export default WrappedReservations;