import React from "react";
import { Calendar, Tag, Tooltip, Button, Icon } from 'antd';
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
                            out[jr.photoshoot_date][jr.photoshoot_time] = true;
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
    selectTime = (data) => {
        // console.log(data);
        let out = {...this.state.selectedTimes};
        if (out[data.photoshoot_date]) {
            if (out[data.photoshoot_date][data.avail_time]) {
                delete out[data.photoshoot_date][data.avail_time]
            } else {
                out[data.photoshoot_date][data.avail_time] = data
            }
        } else {
            out[data.photoshoot_date] = {};
            out[data.photoshoot_date][data.avail_time] = data
        }
        this.setState({ selectedTimes: out});
    }
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        const { enableReserve } = this.props;
        const { selectedTimes } = this.state;
        // console.log(listData);
        return (
          <div>
            { enableReserve ? (
                (listData.content && 
                    listData.content.map((e,i) => {
                        const isSelected = selectedTimes[e.photoshoot_date] ? selectedTimes[e.photoshoot_date][e.avail_time] : false
                        return (
                            <Tooltip 
                                title={isSelected ? "Unselect" : "Select Time"} 
                                key={i+value} 
                                className="mb-1"
                            >
                                <Tag 
                                    color={isSelected ? "#51bba8" : ""}
                                    style={{ whiteSpace: 'normal', cursor: 'pointer' }} 
                                    onClick={() => this.selectTime(e, value)}
                                >
                                    {e.label}
                                </Tag>
                            </Tooltip>
                        )
                    })
                )
            ) : (
                (listData.content && (
                    listData.content.map((e,i) => {
                        return (
                            <Tag 
                                color="green"
                                style={{ whiteSpace: 'normal' }} 
                                key={i + value}
                                className="mb-1"
                            >
                                {e.label}
                            </Tag>
                        )
                    })
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