import React from "react"
import { Redirect } from "react-router-dom";
import { Table } from "antd";
import { formatDateTime } from "common/date";
import { getCurrentClient } from "common/auth";
import { statusLabels, getNotifications } from "logic/Notifications";

const columns = [{
    title: 'Description',
    dataIndex: 'noti_status',
    key: 'noti_status',
    render: status => {
        return <span>Your job status has been updated to {statusLabels[status]}</span>
    }
},{
    title: 'Time',
    dataIndex: "noti_timestamp",
    key: "noti_timestamp",
    render: time => {
        formatDateTime(time)
    }
}];

class Notifications extends React.Component {
    async componentDidMount () {
        const currentClient = getCurrentClient();
        const n = await getNotifications(currentClient.username);
        this.setState({ notifications: n });
    }
    state = {
        notifications: [],
    }
    render() {
        const currentClient = getCurrentClient();
        if (currentClient.type !== 2) {
            return <Redirect to="/"/>
        }

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