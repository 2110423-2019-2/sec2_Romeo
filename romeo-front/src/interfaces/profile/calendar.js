import React from "react";
import { Calendar, Tag, Tooltip, Button, Icon } from 'antd';
import moment from "moment";
import { dayIndex, defaultDays, timeLabels } from "logic/Calendar";
import ReserveModal from "./ReserveModal";

class JobCalendar extends React.Component {
    state = {
        today: moment(new Date()),
        calOutput: defaultDays,
        showReserveModal: false,
        selectedTimes: {}
    };
    componentDidMount() {
        const { currentPhotographer } = this.props;
        const { photographer_avail_time } = currentPhotographer;
        
        let out = [...this.state.calOutput];
        photographer_avail_time.forEach((e,i) => {
            out.splice(dayIndex[e.avail_date],1)
            out.splice(dayIndex[e.avail_date],0,e)
        });
        this.setState({ calOutput: out });
    }
    selectTime = (data, value) => {
        let out = {...this.state.selectedTimes};
        if (out[moment(value)]) {
            delete out[moment(value)]
        } else {
            out[moment(value)] = data;
        }
        this.setState({ selectedTimes: out});
    }
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        const { enableReserve } = this.props;
        const { selectedTimes } = this.state;
        return (
          <div>
            { enableReserve ? (
                listData.content && (
                    <Tooltip title={selectedTimes[value] ? "Unselect" : "Select Time"}>
                        <Tag 
                            color={selectedTimes[value] ? "#51bba8" : ""}
                            style={{ whiteSpace: 'normal' }} 
                            onClick={() => this.selectTime(listData.data, value)}
                        >
                            {listData.content}
                        </Tag>
                    </Tooltip>
                )
            ) : (
                listData.content && (
                    <Tag 
                        color="green" 
                        style={{ whiteSpace: 'normal' }}
                        
                    >
                        {listData.content}
                    </Tag>
                )
            )}
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
    componentWillUnmount() {
        this.setState({
            calOutput: defaultDays
        })
    }

    getListData = (value) => {
        const { calOutput } = this.state;
        switch (value.day()) {
            case 0: return {
                content: this.getLabel(calOutput[6]),
                data: calOutput[6]
            };
            case 1: return {
                content: this.getLabel(calOutput[0]),
                data: calOutput[0]
            };
            case 2: return {
                content: this.getLabel(calOutput[1]),
                data: calOutput[1]
            };
            case 3: return {
                content: this.getLabel(calOutput[2]),
                data: calOutput[2]
            };
            case 4: return {
                content: this.getLabel(calOutput[3]),
                data: calOutput[3]
            };
            case 5: return {
                content: this.getLabel(calOutput[4]),
                data: calOutput[4]
            };
            case 6: return {
                content: this.getLabel(calOutput[5]),
                data: calOutput[5]
            };
            default: return {
                content: ""
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