import React from "react"
import { Link } from "react-router-dom";
import { Table, Button, Icon } from "antd";
import { formatDateTime } from "common/date";
import { getCurrentClient } from "common/auth";
import { getNotificationText, readNotifications } from "logic/Notifications";
import Axios from "axios"


const columns = [{
    title: 'Description',
    dataIndex: 'noti_status',
    key: 'noti_status',
    render: (status, record) => {
        return getNotificationText(record.noti_actor, status)
    }
},{
    title: 'Time',
    dataIndex: "noti_timestamp",
    key: "noti_timestamp",
    render: time => {
        return <span>{formatDateTime(time)}</span>
    }
},{
    title: '',
    dataIndex: "noti_job_id",
    key: "noti_job_id",
    render: job_id => {
        return <Link to={`/client/reservations/${job_id}`}>
            <Button shape="round">
                Reservation Details 
                <Icon type="right"/>
            </Button>
        </Link>
    }
}];

class Notifications extends React.Component {
    async componentDidMount () {
        const currentClient = getCurrentClient();
        const res = await Axios.get("/api/notification/?search=" + currentClient.username);
        if (res.data) {
            const read = await readNotifications(res.data.sort((a,b) => a.noti_id - b.noti_id));
            this.setState({ notifications: read.reverse() });
        }
    }
    state = {
        notifications: [],
    }
    render() {
        const { notifications } = this.state;
        return (
            <div className="container mt-4 with-sidebar pl-4">
                <h1>My Notifications</h1>
                { notifications.length >= 0 && (
                    <Table dataSource={notifications} columns={columns} />
                )}
            </div>
        )
    }
}

export default Notifications;