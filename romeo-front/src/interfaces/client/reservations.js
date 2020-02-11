import React from "react"
import { Redirect } from "react-router-dom";
import { getAllReservations } from "logic/Reservations";
import { Table, Button } from "antd";
import { formatDateTime } from "common/date";

const columns = [{
    title: 'Description',
    dataIndex: 'jobDesc',
    key: 'jobDesc'
},{
    title: 'Start Date/Time',
    dataIndex: 'startDate',
    key: 'startDate',
    render: date => {
        return <span>{formatDateTime(date)}</span>
    }
},{
    title: 'End Date/Time',
    dataIndex: 'endDate',
    key: 'endDate',
    render: date => {
        return <span>{formatDateTime(date)}</span>
    }
},{
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
},{
    title: 'Status',
    dataIndex: 'jobStatus',
    key: 'jobStatus'
}]

class Reservations extends React.Component {

    state = {
        reservations: []
    }

    componentDidMount() {
        this.setState({ reservations: getAllReservations() });
    }
    render() {
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));
        if (currentClient.type !== 'CUSTOMER') {
            return <Redirect to="/"/>
        }

        const { reservations } = this.state;
        return (
            <React.Fragment>
                <h1>My Reservations</h1>
                { reservations.length >= 0 && (
                    <Table dataSource={reservations} columns={columns} />
                )}
            </React.Fragment>
        )
    }
}

export default Reservations;