import React from "react";
import { setCurrentAvailTimes } from "./actions";
import { connect } from "react-redux";
import { Select, Input, Icon, Button } from "antd";
import { timeLabels } from "logic/Calendar"; 

class TimeSlot extends React.Component {
    state = {
        editEnabled: false,
        currentPrice: 0,
        currentTime: ""
    }
    componentDidMount() {
        const { editEnabled, price } = this.props;
        this.setState({
            editEnabled,
            currentPrice: price
        })
    }
    addAvailTime = () => {
        const { currentPrice, currentTime } = this.state;
        const { currentAvailTimes, data, setCurrentAvailTimes } = this.props;


        let outDay = {...currentAvailTimes[data.avail_date]};
        outDay[currentTime] = {
            avail_time: currentTime,
            photographer_price: currentPrice,
            avail_date: data.avail_date
        };
        let out = {...currentAvailTimes};
        out[data.avail_date] = outDay

        setCurrentAvailTimes(out);

        this.setState({ currentPrice: 0, currentTime: ""})
    }
    removeAvailTime = () => {
        const { currentAvailTimes, setCurrentAvailTimes, data } = this.props;
        let out = {...currentAvailTimes};
        let outDay = out[data.avail_date];
        delete outDay[data.avail_time];
        out[data.avail_date] = outDay;
        setCurrentAvailTimes(out);
        this.setState({ currentPrice: 0, currentTime: ""})
    }
    render() {
        const { currentPrice, currentTime } = this.state;
        const { editEnabled, data, className, choices } = this.props;
        return (
            <div 
                className={`pa-2 rounded-1 d-flex justify-space-between mr-2 mb-2 ${className}`} 
                style={{ backgroundColor: 'rgba(100,100,100,0.1)', maxWidth: 300, minWidth: 200}}
            >
                { editEnabled ? (
                    <div>
                        <label>Time</label>
                        <Select
                            onChange={e => this.setState({ currentTime: e })}
                            defaultValue=""
                            className="mb-3"
                        >
                            <Select.Option value="">Please Select Time</Select.Option>
                            { Object.keys(choices).map((k,i) => (
                                <Select.Option value={k} key={k + 'select' + i}>
                                    {choices[k]}
                                </Select.Option>
                            ))}
                        </Select>
                        <label>Price</label><br/>
                        <small>Must be greater than or equal to 100THB</small>
                        <Input
                            onChange={e => this.setState({ currentPrice: e.target.value })}
                            value={currentPrice}
                            className="mb-3"
                            type="number"
                        />
                        <Button 
                            type="primary" 
                            disabled={currentTime === "" || 
                                currentPrice === "" || isNaN(parseInt(currentPrice)) || parseInt(currentPrice) < 100
                            }
                            onClick={() => this.addAvailTime()}
                        >
                            Add Available Time <Icon type="plus"/>
                        </Button>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="mr-4">
                            <label>Time</label>
                            <b className="d-block mb-2">{timeLabels[data.avail_time]}</b>
                            <label>Price</label>
                            <b className="d-block">{data.photographer_price}</b>
                        </div>
                        <div>
                            <Button type="danger" onClick={() => this.removeAvailTime()}>
                                <Icon type="delete"/>
                            </Button>
                        </div>
                    </React.Fragment>
                ) }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentAvailTimes: state.editProfile.currentAvailTimes
})

const mapDispatchToProps = {
    setCurrentAvailTimes
};

export default connect(mapStateToProps,mapDispatchToProps)(TimeSlot);