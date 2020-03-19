import React from "react";
import { Calendar, Tag } from 'antd';
import moment from "moment";
import { defaultDays, dayIndex } from "logic/Calendar";

const timeLabels = {
    HALF_DAY_MORNING: 'Half-Day (Morning-Noon)',
    HALF_DAY_NOON: 'Half-Day (Noon-Evening)',
    FULL_DAY: 'Full-Day',
    NIGHT: 'Night',
    FULL_DAY_NIGHT: 'Full-Day and Night',
}

class JobCalendar extends React.Component {
    state = {
        today: moment(new Date())
    };
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    }
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
          <div>
            { listData.content && <Tag color="green" style={{ whiteSpace: 'normal' }}>{listData.content}</Tag>}
          </div>
        );
    }
    getListData = (value) => {
        const { currentPhotographer } = this.props;
        const { photographer_avail_time } = currentPhotographer;
        // Fill In 
        let out = defaultDays;
        photographer_avail_time.forEach((e,i) => {
            out.splice(dayIndex[e.avail_date],1)
            out.splice(dayIndex[e.avail_date],0,e)
        })
        
        switch (value.day()) {
            case 0: return {
                content: timeLabels[out[6].avail_time]
            };
            case 1: return {
                content: timeLabels[out[0].avail_time]
            };
            case 2: return {
                content: timeLabels[out[1].avail_time]
            };
            case 3: return {
                content: timeLabels[out[2].avail_time]
            };
            case 4: return {
                content: timeLabels[out[3].avail_time]
            };
            case 5: return {
                content: timeLabels[out[4].avail_time]
            };
            case 6: return {
                content: timeLabels[out[5].avail_time]
            };
            default: return {
                content: ""
            }
        }
    }
    render() {
        return (
            <Calendar onPanelChange={this.onPanelChange} dateCellRender={this.dateCellRender}/>
        )
    }
}

export default JobCalendar