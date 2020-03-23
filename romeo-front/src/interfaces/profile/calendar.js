import React from "react";
import { Calendar, Tag } from 'antd';
import moment from "moment";
import { defaultDays, dayIndex } from "logic/Calendar";

const timeLabels = {
    HALF_DAY_MORNING: 'Morning-Noon',
    HALF_DAY_NOON: 'Noon-Evening',
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
    getLabel = (avail_time) => {
        if (timeLabels[avail_time.avail_time]) {
            if (avail_time.photographer_price) {
                return timeLabels[avail_time.avail_time] + ", Price: " + avail_time.photographer_price
            }
            return timeLabels[avail_time.avail_time]
        }
        return null;
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
                content: this.getLabel(out[6])
            };
            case 1: return {
                content: this.getLabel(out[0])
            };
            case 2: return {
                content: this.getLabel(out[1])
            };
            case 3: return {
                content: this.getLabel(out[2])
            };
            case 4: return {
                content: this.getLabel(out[3])
            };
            case 5: return {
                content: this.getLabel(out[4])
            };
            case 6: return {
                content: this.getLabel(out[5])
            };
            default: return {
                content: ""
            }
        }
    }
    render() {
        return (
            <div className="calendar-wrapper">
                <div className="calendar-container">
                    <Calendar onPanelChange={this.onPanelChange} dateCellRender={this.dateCellRender}/>
                </div>
            </div>
        )
    }
}

export default JobCalendar