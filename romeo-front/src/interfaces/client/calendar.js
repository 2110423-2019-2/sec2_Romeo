import React from "react";
import { Calendar, Tag } from "antd";
import { formatDashedDate } from "common/date";
import history from "common/router/history";
import Axios from "axios";
import { getCurrentClient } from "common/auth";
import { timeLabels } from "logic/Calendar";
import { Link } from "react-router-dom";

class UserCalendar extends React.Component {
    async componentDidMount () {
        const currentClient = getCurrentClient();
        this.setState({ currentClient })
        try {
            const res = await Axios.get("/api/jobs/?search=" + currentClient.username);
            if (res.data) {
                this.mapJobs(res.data);
            }
        } catch (err) {
            console.log(err);
            history.push("/client");
        }
    }
    state = {
        mappedJobs: {},
        currentClient: null
    }
    mapJobs = (jobs) => {
        let out = {};
        jobs.forEach(j => {
            if (j.job_status === "PAID" || j.job_status === "PROCESSING" || j.job_status === "COMPLETED") {
                j.job_reservation.forEach(jr => {
                    out[jr.photoshoot_date] = {
                        photoshoot_time: jr.photoshoot_time,
                        photographer: j.job_photographer,
                        customer: j.job_customer,
                        job_id: j.job_id
                    };
                })
                out[j.job_expected_complete_date] = {
                    photographer: j.job_photographer,
                    customer: j.job_customer,
                    job_id: j.job_id
                }
            }
        });
        this.setState({ mappedJobs: out })
    };
    dateCellRender = (value) => {
        const { mappedJobs, currentClient } = this.state;
        return (
            <div>
                {mappedJobs[formatDashedDate(value)] && (
                    <Link to={`/client/reservations/${mappedJobs[formatDashedDate(value)].job_id}`}>
                        <Tag color={mappedJobs[formatDashedDate(value)].photoshoot_time ? "green" : "red"} style={{ whiteSpace: 'initial', cursor: 'pointer' }}>
                            {
                                mappedJobs[formatDashedDate(value)].photoshoot_time ? (
                                    <span>{timeLabels[mappedJobs[formatDashedDate(value)].photoshoot_time]},</span>
                                ) : (
                                    <span>Complete Photos,</span>
                                )
                            }<br/>
                            { currentClient.type === 1 ? (
                                <span>Customer: {mappedJobs[formatDashedDate(value)].customer}</span>
                            ) : (
                                <span>Photographer: {mappedJobs[formatDashedDate(value)].photographer}</span>
                            )}
                        </Tag>
                    </Link>
                )}
            </div>
        )
    }
    render() {
        const { currentClient, mappedJobs } = this.state;
        return (
            <div className="container mt-4 with-sidebar pl-4">
                <h1 className="mb-2">My Calendar</h1>
                <p className="t-color-light">Only paid and active jobs are shown.</p>
                { ( currentClient && mappedJobs )&& (
                     <div className="calendar-wrapper">
                        <div className="calendar-container">
                            <Calendar 
                                dateCellRender={this.dateCellRender}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default UserCalendar