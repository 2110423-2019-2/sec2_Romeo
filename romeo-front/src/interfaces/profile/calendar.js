import React from "react";
import { Calendar, Tag } from 'antd';
import moment from "moment";
import { getCurrentClient } from "logic/Client";

const timeLabels = {
    HALF_DAY_MORNING: 'Half-Day (Morning-Noon)',
    HALF_DAY_NOON: 'Half-Day (Noon-Evening)',
    FULL_DAY: 'Full-Day',
    NIGHT: 'Night',
    FULL_DAY_NIGHT: 'Full-Day and Night',
}

function getListData(value) {
    const currentClient = getCurrentClient();
    const { availTimes } = currentClient;

    switch (value.day()) {
        case 0: return {
            content: timeLabels[availTimes[6].time]
        };
        case 1: return {
            content: timeLabels[availTimes[0].time]
        };
        case 2: return {
            content: timeLabels[availTimes[1].time]
        };
        case 3: return {
            content: timeLabels[availTimes[2].time]
        };
        case 4: return {
            content: timeLabels[availTimes[3].time]
        };
        case 5: return {
            content: timeLabels[availTimes[4].time]
        };
        case 6: return {
            content: timeLabels[availTimes[5].time]
        }
    }
}

function dateCellRender(value) {
    const listData = getListData(value);
    console.log(listData);
    return (
      <div>
        { listData.content && <Tag color="green" style={{ whiteSpace: 'normal' }}>{listData.content}</Tag>}
      </div>
    );
}

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
            <Calendar onPanelChange={this.onPanelChange} dateCellRender={dateCellRender}/>
        )
    }
}

export default JobCalendar