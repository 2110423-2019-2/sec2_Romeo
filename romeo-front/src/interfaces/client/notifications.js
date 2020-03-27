import React from "react"
import { Redirect } from "react-router-dom";
import { Table } from "antd";
import { formatDateTime } from "common/date";
import { getCurrentClient } from "common/auth";
import { getNotificationText } from "logic/Notifications";
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
}];

class Notifications extends React.Component {
    async componentDidMount () {
        const currentClient = getCurrentClient();
        const res = await Axios.get("/api/notification/?search=" + currentClient.username);
        this.setState({ notifications: res.data });
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