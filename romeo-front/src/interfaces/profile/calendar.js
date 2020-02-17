import React from "react";
import { Calendar } from 'antd';
import moment from "moment";

class JobCalendar extends React.Component {
    state = {
        today: moment(new Date())
    };
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    }
    render() {
        const { today } = this.state;
        return (
            <Calendar onPanelChange={this.onPanelChange}/>
        )
    }
}

export default JobCalendar