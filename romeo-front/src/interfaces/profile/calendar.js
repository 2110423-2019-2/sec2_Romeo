import React from "react";
import { Calendar, Tag, Tooltip, Button, Icon,
Form, Dropdown, Radio, Menu } from 'antd';
import moment from "moment";
import { timeLabels } from "logic/Calendar";
import Axios from "axios";
import ReserveModal from "./ReserveModal";
import { formatDashedDate } from "common/date";

class JobCalendar extends React.Component {
    state = {
        today: moment(new Date()),
        calOutput: {
            MONDAY: {},
            TUESDAY: {},
            WEDNESDAY: {},
            THURSDAY: {},
            FRIDAY: {},
            SATURDAY: {},
            SUNDAY: {}
        },
        showReserveModal: false,
        selectedTimes: {},
        unavailableTimes: {}
    };
    async componentDidMount() {
        const { currentPhotographer } = this.props;
        const { photographer_avail_time } = currentPhotographer;

        try {
            const res = await Axios.get("/api/jobs?search="+currentPhotographer.profile.user.username);
            if (res.data) {
                const jobs = res.data;
                let out = {};
                jobs.forEach(j => {
                    if (j.job_status === "MATCHED" || j.job_status === "PAID" || j.job_status === "PROCESSING") {
                        j.job_reservation.forEach(jr => {
                            out[jr.photoshoot_date] = {}
                            out[jr.photoshoot_date][jr.photoshoot_time] = true;
                            if (jr.photoshoot_time === "HALF_DAY_MORNING") {
                                out[jr.photoshoot_date]["FULL_DAY"] = true;
                                out[jr.photoshoot_date]["FULL_DAY_NIGHT"] = true;
                            }
                            if (jr.photoshoot_time === "HALF_DAY_NOON") {
                                out[jr.photoshoot_date]["FULL_DAY"] = true;
                                out[jr.photoshoot_date]["FULL_DAY_NIGHT"] = true;
                            }
                            if (jr.photoshoot_time === "FULL_DAY") {
                                out[jr.photoshoot_date]["HALF_DAY_MORNING"] = true;
                                out[jr.photoshoot_date]["HALF_DAY_NOON"] = true;
                            }
                            if (jr.photoshoot_time === "NIGHT") {
                                out[jr.photoshoot_date]["FULL_DAY_NIGHT"] = true;
                            }
                            if (jr.photoshoot_time === "FULL_DAY_NIGHT") {
                                out[jr.photoshoot_date]["HALF_DAY_MORNING"] = true;
                                out[jr.photoshoot_date]["HALF_DAY_NOON"] = true;
                                out[jr.photoshoot_date]["FULL_DAY"] = true;
                                out[jr.photoshoot_date]["NIGHT"] = true;
                            }
                        })
                    }
                });
                this.setState({ unavailableTimes: out })
            }
        } catch (err) {
            console.log(err);
        }

        let out = {...this.state.calOutput};
        photographer_avail_time.forEach(e => {
            out[e.avail_date][e.avail_time] = {
                avail_date: e.avail_date,
                avail_time: e.avail_time,
                photographer_price: e.photographer_price
            }
        });
        this.setState({ out });
    }
    selectTime = (e) => {
        let out = {...this.state.selectedTimes};
        let data = e.target.value;
        if (out[data.photoshoot_date]) {
            if (data.avail_time !== null) {
                out[data.photoshoot_date] = data;
            } else {
                delete out[data.photoshoot_date];
            }
        } else {
            out[data.photoshoot_date] = data
        }
        this.setState({ selectedTimes: out});
    }
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        const { enableReserve } = this.props;
        const { selectedTimes } = this.state;
        const date = formatDashedDate(value);
        const isSelected = selectedTimes[date] ? true : false
        // console.log(listData);
        return (
          <div>
            { enableReserve ? (
                ((listData.content && listData.content.length > 0) && 
                    (isSelected ? (
                        <Tooltip title="Unselect">
                            <Tag 
                                color="#51bba8"
                                style={{ whiteSpace: 'normal', cursor: 'pointer' }} 
                                onClick={() => this.selectTime({
                                    target: {
                                        value: {
                                            photoshoot_date: date,
                                            avail_time: null
                                        }
                                    }
                                })}
                            >
                                <b>Selected</b><br/>
                                <span className="d-block">
                                    {timeLabels[selectedTimes[date].avail_time]},{' '}
                                    Price: {selectedTimes[date].photographer_price}
                                </span>
                            </Tag>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Select">
                            <Dropdown trigger={['click']} overlay={() => (
                                <Form className="pa-3">
                                    <Radio.Group 
                                        onChange={this.selectTime} 
                                        value={this.state.selectedTimes[date]}
                                        className="vertical"
                                    >
                                        { listData.content.map((e,i) => (
                                            <Radio 
                                                value={e} 
                                                key={i + e.photoshoot_date + e.avail_time}
                                                style={{display: 'block'}}
                                            >
                                                {e.label}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form>
                            )}>
                                <Tag 
                                    style={{ whiteSpace: 'normal', cursor: 'pointer' }}
                                >
                                    <b>Available</b>
                                    {
                                        listData.content.map((e,i) => {
                                            return (
                                                <span 
                                                    className="d-block mb-1"
                                                    key={i + value}
                                                >
                                                    {e.label}
                                                </span>
                                            )
                                        })
                                    }
                                </Tag>
                            </Dropdown>
                        </Tooltip>
                    )
                ))
            ) : (
                ((listData.content && listData.content.length > 0) && (
                    <Tag 
                        color="green"
                        style={{ whiteSpace: 'normal' }} 
                    >
                        <b>Available</b><br/>
                        {
                            listData.content.map((e,i) => {
                                return (
                                    <span 
                                        className="d-block mb-1"
                                        key={i + value}
                                    >
                                        {e.label}
                                    </span>
                                )
                            })
                        }
                    </Tag>
                )
            ))}
          </div>
        );
    }
    getContent = (day, date) => {
        const { unavailableTimes } = this.state;
        const d = formatDashedDate(date)
        let out = [];
        if (day) {
            Object.keys(day).forEach(t => {
                const r = day[t];
                if ( !unavailableTimes[d] 
                || !unavailableTimes[d][r.avail_time] ) {
                    out.push({
                        ...r,
                        photoshoot_date: d,
                        label:timeLabels[r.avail_time] + ", Price: " + r.photographer_price
                    });
                }
            })
            return out;
        }
        return null;
    }
    getListData = (value) => {
        const { calOutput } = this.state;
        if (moment(value).subtract(1,"days").isBefore(new Date())) {
            return {
                content: null
            }
        }
        switch (value.day()) {
            case 0: return {
                content: this.getContent(calOutput.SUNDAY, value),
            };
            case 1: return {
                content: this.getContent(calOutput.MONDAY, value),
            };
            case 2: return {
                content: this.getContent(calOutput.TUESDAY, value),
            };
            case 3: return {
                content: this.getContent(calOutput.WEDNESDAY, value),
            };
            case 4: return {
                content: this.getContent(calOutput.THURSDAY, value),
            };
            case 5: return {
                content: this.getContent(calOutput.FRIDAY, value),
            };
            case 6: return {
                content: this.getContent(calOutput.SATURDAY, value),
            };
            default: return {
                content: null
            }
        }
    }
    render() {
        const { fullscreen, 
            currentPhotographer, 
            currentClient,
            enableReserve
        } = this.props;
        const { showReserveModal, selectedTimes } = this.state;
        return (
            <React.Fragment>
                { enableReserve && (
                    <div className="mb-2" style={{ textAlign: 'center' }}>
                        <span className="secondary-label" style={{ letterSpacing: 2, fontWeight: 'normal' }}>
                            Click the available times on the calendar to start reserving.
                        </span>
                        <Button 
                            type="primary" 
                            shape="round"
                            className="ml-2 mb-2 mt-2"
                            onClick={() => this.setState({ showReserveModal: true })}
                            disabled={!Object.keys(selectedTimes).length > 0}
                        >
                            PROCEED
                            <Icon type="caret-right"/>
                        </Button>
                    </div>
                )}
                <div className="calendar-wrapper">
                    <div className="calendar-container">
                        <Calendar 
                            onPanelChange={this.onPanelChange} 
                            dateCellRender={this.dateCellRender}
                            fullscreen={fullscreen}
                        />
                    </div>
                    { (showReserveModal && selectedTimes) && (
                        <ReserveModal
                            visible={showReserveModal}
                            onCancel={() => this.setState({ showReserveModal: false })}
                            currentClient={currentClient}
                            currentPhotographer={currentPhotographer}
                            selectedTimes={selectedTimes}
                        />
                    )}
                </div>
            </React.Fragment>
        )
    }
}

export default JobCalendar