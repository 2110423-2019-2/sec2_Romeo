import React from "react";
import { getCurrentClient } from "common/auth";
import { timeLabels } from "logic/Calendar";
import Axios from "axios";
import { formatDate } from "common/date";
import { statusLabels } from "logic/Reservation";
import { styleLabels } from "logic/Styles";
import { Button, Icon } from "antd";
import { Link } from "react-router-dom";
import { calculateTotalPrice, calculateDepositPrice } from "./reservations";
import history from "common/router/history"

const showContactStatuses = [
    "PAID",
    "PROCESSING",
    "COMPLETED",
    "CLOSED"
];

class JobDetails extends React.Component {
    state = {
        currentJob: null
    }
    async componentDidMount() {
        const { jobId } = this.props.match.params;
        try {
            const res = await Axios.get("/api/getjobs/" + jobId);
            if (res.data) {
                this.setState({ currentJob: res.data })
            }
        } catch (err) {
            history.push("/client/reservations");
        }
    }

    render() {
        const { currentJob } = this.state;
        return (
            <div className="container mt-4 with-sidebar pl-4 mb-5" style={{ fontSize: 15 }}>
                { currentJob && (
                    <React.Fragment>
                        <div className="mb-4">
                            <h1 className="mr-3 mb-0">Reservation details</h1>
                            <Link to="/client/reservations">
                                <Button type="link">
                                    <Icon type="left"/>
                                    Back to Reservations Table
                                </Button>
                            </Link>
                        </div>
                        <Content label="Title" content={currentJob.job_title}/>
                        <Content 
                            label="Status" 
                            content={`${statusLabels[currentJob.job_status]} ${
                                (currentJob.job_status === "DECLINED" && getCurrentClient().type === 2) ?
                                "(Your reservation has been declined by the photographer)" : ""
                            }`}
                        />
                        <Content label={ 
                            getCurrentClient().type === 1 ? "Customer" : "Photographer"
                        } content={
                            getCurrentClient().type === 1 ? (
                                `${currentJob.job_customer.profile.user.username}${' '} 
                                (${currentJob.job_customer.profile.user.first_name} ${currentJob.job_customer.profile.user.last_name})`
                            ) : (
                                `${currentJob.job_photographer.profile.user.username}${' '}  
                                (${currentJob.job_photographer.profile.user.first_name} ${currentJob.job_photographer.profile.user.last_name})`
                            )
                        }/>
                        <Content label="Location" content={currentJob.job_location} />
                        <Content label="Style" content={styleLabels[currentJob.job_style]} />
                        <Content 
                            label={
                                getCurrentClient().type === 1 ? "Customer's Phone" : "Photographer's Phone"
                            } 
                            content={
                                showContactStatuses.includes(currentJob.job_status) ? (
                                    getCurrentClient().type === 1 ? (
                                        currentJob.job_customer.profile.phone
                                    ) : (
                                        currentJob.job_photographer.profile.phone
                                    )
                                ) : (
                                    "Phone number is displayed only when the job is paid and not cancelled."
                                )
                            }
                            contentClass={
                                showContactStatuses.includes(currentJob.job_status) ? "" : "t-color-light"
                            }
                        />
                        <Content 
                            label={
                                getCurrentClient().type === 1 ? "Customer's Email" : "Photographer's Email"
                            } 
                            content={
                                showContactStatuses.includes(currentJob.job_status) ? (
                                    getCurrentClient().type === 1 ? (
                                        currentJob.job_customer.profile.user.email
                                    ) : (
                                        currentJob.job_photographer.profile.user.email
                                    )
                                ) : (
                                    "Email is displayed only when the job is paid and not cancelled."
                                )
                            }
                            contentClass={
                                showContactStatuses.includes(currentJob.job_status) ? "" : "t-color-light"
                            }
                        />
                        <div className="mb-3">
                            <b>Reservation Times and Prices</b><br/>
                            <ul>
                                {currentJob.job_reservation.map((e,i) => (
                                    <li className="mb-1" key={"job_time" + i}>
                                        <span>{formatDate(e.photoshoot_date)}, {' '}
                                        {timeLabels[e.job_avail_time.avail_time]}: {e.job_avail_time.photographer_price}THB</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Content label="Total Price" content={`${calculateTotalPrice(currentJob.job_reservation)}THB`} />
                        <Content label="Deposit" content={`${calculateDepositPrice(currentJob.job_reservation)}THB`} />
                        <Content label="Expected Complete Date" content={formatDate(currentJob.job_expected_complete_date)} />
                        <div className="mb-3">
                            <b className="d-block mb-1">Job Description</b>
                            <span 
                                className={`${currentJob.job_description && currentJob.job_description !== "" ? "" : "t-color-light"}`}
                            >
                                {currentJob.job_description && currentJob.job_description !== "" ? currentJob.job_description : "No Description Provided"}
                            </span>
                        </div>
                        <div className="mb-3">
                            <b className="d-block mb-1">Special Requirements</b>
                            <span 
                                className={`${currentJob.job_special_requirement && currentJob.job_special_requirement !== "" ? "" : "t-color-light"}`}
                            >
                                {currentJob.job_special_requirement && currentJob.job_special_requirement !== "" ? currentJob.job_special_requirement : "None Provided"}
                            </span>
                        </div>
                        <div className="mb-3">
                            <b className="d-block mb-1">Photos</b>
                            {
                                getCurrentClient().type === 1 ? (
                                    (currentJob.job_status === "COMPLETED" || currentJob.job_status === "CLOSED") ? (
                                        <a href={currentJob.job_url} target="_blank">
                                            <Button type="primary" shape="round">
                                                See Photos
                                            </Button>
                                        </a>
                                    ) : ( <span className="t-color-light">Not Available.</span> )
                                ) : (
                                    (currentJob.job_status === "CLOSED") ? (
                                        <a href={currentJob.job_url} target="_blank">
                                            <Button type="primary" shape="round" className="mt-2">
                                                See Photos
                                            </Button>
                                        </a>
                                    ) : ( <span className="t-color-light">
                                        {(currentJob.job_status ==="COMPLETED") 
                                        ? "You haven't paid the full price for your job. Please make the payment to see photos."
                                        : "Not Available."}
                                    </span> )
                                )
                            }
                        </div>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

const Content = ({ label, content, contentStyle, contentClass }) => (
    <div className="mb-3">
        <div className="d-flex">
            <b className="d-block mr-2">{label}:</b>
            <span style={contentStyle} className={contentClass}>{content}</span>
        </div>
    </div>
)

export default JobDetails;