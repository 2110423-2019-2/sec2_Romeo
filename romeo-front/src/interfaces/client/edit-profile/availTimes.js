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

class AvailTimes extends React.Component {
   
    onChange = (e, day) => {
        console.log({
            day,
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
                    <div className="snippet secondary">
                        <Tag color="gold">Monday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'MONDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="magenta">Tuesday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'TUESDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="green">Wednesday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'WEDNESDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="orange">Thursday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'THURSDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="blue">Friday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'FRIDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="purple">Saturday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'SATURDAY')} />
                    </div>
                    <div className="snippet secondary">
                        <Tag color="volcano">Sunday</Tag>
                        <Radio.Group options={options} defaultValue="NOT_AVAILABLE" onChange={(e) => this.onChange(e, 'SUNDAY')} />
                    </div>
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