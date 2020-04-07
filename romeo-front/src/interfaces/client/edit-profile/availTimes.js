import React from "react";
import { Button, Icon, Form, Tag } from "antd";
import { connect } from "react-redux";
import { setCurrentAvailTimes } from "./actions";
import TimeSlot from "./TimeSlot";
import { timeLabels } from "logic/Calendar";

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
    componentDidMount() {
        const { currentClient, setCurrentAvailTimes } = this.props;
        let availTimes = currentClient.photographer_avail_time;
        if (availTimes) {
            let currentAvailTimes = {...this.props.currentAvailTimes}
            availTimes.forEach(e => {
                currentAvailTimes[e.avail_date][e.avail_time] = {
                    photographer_price: e.photographer_price,
                    avail_time: e.avail_time,
                    avail_date: e.avail_date,
                    id: e.id,
                }
            });
            setCurrentAvailTimes(currentAvailTimes)
            this.setChoices();
        }
        
    }

    setChoices = () => {
        let currentAvailTimes = {...this.props.currentAvailTimes}
        console.log(currentAvailTimes);
        let c = {
            MONDAY: {...timeLabels},
            TUESDAY: {...timeLabels},
            WEDNESDAY: {...timeLabels},
            THURSDAY: {...timeLabels},
            FRIDAY: {...timeLabels},
            SATURDAY: {...timeLabels},
            SUNDAY: {...timeLabels}
        }
        Object.keys(currentAvailTimes).forEach((day,i) => {
            const times = currentAvailTimes[day]
            Object.keys(times).forEach((time, it) => {
                if (c[day][time]) delete c[day][time];
            });
        })
        this.setState({ choices: c });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            if (prevProps.currentAvailTimes !== this.props.currentAvailTimes) {
                this.setState({ showAdd: {
                    MONDAY: false,
                    TUESDAY: false,
                    WEDNESDAY: false,
                    THURSDAY: false,
                    FRIDAY: false,
                    SATURDAY: false,
                    SUNDAY: false
                }});
                this.setChoices();
            }
        }
    }

    toggleAdd = (day) => {
        let out = {...this.state.showAdd};
        out[day] = true;
        this.setState({ showAdd: out });
    }

    state = {
        showAdd: {
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
            SATURDAY: false,
            SUNDAY: false
        },
        choices: {
            MONDAY: {...timeLabels},
            TUESDAY: {...timeLabels},
            WEDNESDAY: {...timeLabels},
            THURSDAY: {...timeLabels},
            FRIDAY: {...timeLabels},
            SATURDAY: {...timeLabels},
            SUNDAY: {...timeLabels}
        }
    }

    render() {
        const { currentAvailTimes } = this.props;
        const { showAdd, choices } = this.state
        return (
            <React.Fragment>
                <h3>Available Times</h3>
                <Form>
                    { days.map((e,i) => (
                        <div className="snippet secondary d-block" key={i+e.value}>
                            <div style={{ paddingTop: 8 }}/>
                            <Tag color={e.color} style={{ fontSize: 14, padding: 4, marginBottom: 16 }}>{e.label}</Tag>
                            <div className="d-flex flex-wrap align-start" style={{ maxWidth: '100%' }}>
                                { Object.keys(currentAvailTimes[e.value]).map((t,it) => (
                                    <TimeSlot 
                                        key={it + currentAvailTimes[e.value][t].avail_date}
                                        data={{ 
                                            avail_time: currentAvailTimes[e.value][t].avail_time, 
                                            photographer_price: currentAvailTimes[e.value][t].photographer_price,
                                            avail_date: currentAvailTimes[e.value][t].avail_date,
                                        }}
                                        editEnabled={false}
                                    />
                                ))}
                                <TimeSlot 
                                    editEnabled={true}
                                    className={showAdd[e.value] ? "" : "d-none"}
                                    data={{ 
                                        avail_date: e.value,
                                    }}
                                    choices={choices[e.value]}
                                />
                                {
                                    showAdd[e.value] || (
                                        <Button className="mb-2" onClick={() => this.toggleAdd(e.value)}>
                                            Add Available Time
                                            <Icon type="plus" />
                                        </Button>
                                    )
                                }
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