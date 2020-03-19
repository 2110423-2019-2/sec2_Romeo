import React from "react";
import { Radio, Form, Tag, Input } from "antd";
import { connect } from "react-redux";
import { setCurrentAvailTimes } from "./actions";

const options = [
    { label: 'Half-Day (Morning-Noon)', value: 'HALF_DAY_MORNING' },
    { label: 'Half-Day (Noon-Evening)', value: 'HALF_DAY_NOON' },
    { label: 'Full-Day', value: 'FULL_DAY' },
    { label: 'Night', value: 'NIGHT'},
    { label: 'Full-Day and Night', value: "FULL_DAY_NIGHT"},
    { label: 'Not Available', value: "NOT_AVAILABLE"}
  ];

const defaultDays = [{
    avail_date: "MONDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "TUESDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "WEDNESDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "THURSDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "FRIDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "SATURDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
},{
    avail_date: "SUNDAY",
    avail_time: "NOT_AVAILABLE",
    photographer_price: 0
}];

const dayIndex = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6
}

const days = [{
    label: "Monday",
    value: "MONDAY",
    color: "gold",
    index: 0
},{
    label: "Tuesday",
    value: "TUESDAY",
    color: "magenta",
    index: 1
},{
    label: "Wednesday",
    value: "WEDNESDAY",
    color: "green",
    index: 2
},{
    label: "Thursday",
    value: "THURSDAY",
    color: "orange",
    index: 3
},{
    label: "Friday",
    value: "FRIDAY",
    color: "blue",
    index: 4
},{
    label: "Saturday",
    value: "SATURDAY",
    color: "purple",
    index: 5
},{
    label: "Sunday",
    value: "SUNDAY",
    color: "volcano",
    index: 6
}]

class AvailTimes extends React.Component {
   
    onChange = (e, day) => {
        const { currentAvailTimes, setCurrentAvailTimes } = this.props;
        setCurrentAvailTimes([
            ...currentAvailTimes.slice(0,day.index),
            {
                ...currentAvailTimes[day.index],
                avail_date: day.value,
                avail_time: e.target.value
            },
            ...currentAvailTimes.slice(day.index+1,7)
        ]);
    }

    onPriceUpdate = (e, day) => {
        const { currentAvailTimes, setCurrentAvailTimes } = this.props;
        setCurrentAvailTimes([
            ...currentAvailTimes.slice(0,day.index),
            {
                ...currentAvailTimes[day.index],
                photographer_price: e.target.value,
            },
            ...currentAvailTimes.slice(day.index+1,7)
        ]);
    }

    componentDidMount() {
        const { currentClient } = this.props;
        let availTimes = currentClient.photographer_avail_times;
        if (!availTimes) availTimes = [];
        const def = defaultDays;
        // Fill In Empty Times
        let out = defaultDays;
        availTimes.forEach((e,i) => {
            out.splice(dayIndex[e.avail_date],1)
            out.splice(dayIndex[e.avail_date],0,e)
        })
        const { setCurrentAvailTimes } = this.props;
        setCurrentAvailTimes(out);
    }

    render() {
        const { currentAvailTimes } = this.props;
        const { currentClient } = this.props;
        
        console.log(currentAvailTimes);

        return (
            <React.Fragment>
                <h3>Available Times</h3>
                <Form>
                    { days.map((e,i) => (
                        <div className="snippet secondary" key={i+e.value}>
                            <Tag color={e.color}>{e.label}</Tag>
                            <Radio.Group 
                                options={options} 
                                value={currentAvailTimes[e.index].avail_time} 
                                onChange={(ev) => this.onChange(ev, e)} 
                            />
                            <div>
                                <b>Price</b>
                                <div className="ant-row ant-form-item mb-0">
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        <div className="ant-form-item-control has-success">
                                            <span className="ant-form-item-children">
                                                <input 
                                                    placeholder="Price" 
                                                    type="number" 
                                                    className="ant-input"
                                                    onChange={(ev) => this.onPriceUpdate(ev, e)} 
                                                    value={currentAvailTimes[e.index].photographer_price !== undefined ? 
                                                        currentAvailTimes[e.index].photographer_price
                                                    : "0" }
                                                    disabled={currentAvailTimes[e.index].avail_time === "NOT_AVAILABLE"}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Form>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    currentAvailTimes: state.editProfile.currentAvailTimes
})
const mapDispatchToProps = {
    setCurrentAvailTimes
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AvailTimes);