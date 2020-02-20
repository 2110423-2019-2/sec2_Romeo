import React from "react";
import { Radio, Form, Tag } from "antd";
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
                day: day.value,
                time: e.target.value
            },
            ...currentAvailTimes.slice(day.index+1,7)
        ]);
    }
    render() {
        const { currentAvailTimes } = this.props;
        
        return (
            <React.Fragment>
                <h3>Available Times</h3>
                <Form>
                    { days.map((e,i) => (
                        <div className="snippet secondary">
                            <Tag color={e.color}>{e.label}</Tag>
                            <Radio.Group 
                                options={options} 
                                value={currentAvailTimes[e.index].time} 
                                onChange={(ev) => this.onChange(ev, e)} 
                            />
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