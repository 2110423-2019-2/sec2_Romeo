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
},{
    label: "Tuesday",
    value: "TUESDAY",
    color: "magenta",
},{
    label: "Wednesday",
    value: "WEDNESDAY",
    color: "green",
},{
    label: "Thursday",
    value: "THURSDAY",
    color: "orange",
},{
    label: "Friday",
    value: "FRIDAY",
    color: "blue",
},{
    label: "Saturday",
    value: "SATURDAY",
    color: "purple",
},{
    label: "Sunday",
    value: "SUNDAY",
    color: "volcano",
}]

class AvailTimes extends React.Component {
   
    onChange = (e, day) => {
        console.log({
            day: day.value,
            time: e.target.value
        });
    }
    
    render() {
        const { currentAvailTimes } = this.props;
        console.log(currentAvailTimes);
        
        return (
            <React.Fragment>
                <h3>Available Times</h3>
                <Form>
                    { days.map((e,i) => (
                        <div className="snippet secondary">
                            <Tag color={e.color}>{e.label}</Tag>
                            <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(ev) => this.onChange(ev, e)} />
                        </div>
                    ))}
                </Form>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    currentAvailTimes: state.editProfile.currentStyles
})
const mapDispatchToProps = {
    setCurrentAvailTimes
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AvailTimes);