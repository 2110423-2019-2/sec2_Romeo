import React from "react";
import { connect } from "react-redux"; 
import { Parallax } from 'react-parallax';
import Card from "./Card";
import Axios from "axios";
import { Input, Skeleton, Card as AntCard, Avatar, Icon, Dropdown, 
    Form, Radio, Button, DatePicker} from "antd";
import { getCurrentClientInfo } from "common/auth";
import { availableStyles } from "logic/Styles"
import { availableSorts } from "logic/Listing"
import { timeLabels } from "logic/Calendar"
import { formatSnakeDate } from "common/date";

class Listing extends React.Component {

    state = {
        photographers: [],
        currentClient: null,
        typing: false,
        typingTimeout: 0,
        params: {
            user: "",
            style: "",
            activeSort: "",
            dayType: "",
            date: ""
        },
        pagination: {
            next: null,
            prev: null
        }
    }

    componentDidMount = async () => {
        this.setState({ loading: true })
        const res =  await Axios.get("/api/photographersearch");
        console.log(res);
        const currentClient = await getCurrentClientInfo();
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false,
            currentClient
        });
    }

    onPaginationClick = async (np) => {
        const { next, prev } = this.state.pagination;
        this.setState({ loading: true });
        const res =  await Axios.get(np === 0 ? next : prev);
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false,
        });
    }

    searchPhotographers = async (value) => {
        this.setState({ loading: true });

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            params: {
                ...this.state.params,
                user: value
            },
            typing: false,
            typingTimeout: setTimeout(() => {
                this.search(value);
            }, 3000)
         });
    }

    getParamString = (params) => {
        // Filter out params with empty string or null params
        const keys = Object.keys(params);
        let out = {};
        keys.forEach(e => {
            if (params[e] && params[e] !== "") {
                out[e] = params[e]
            }
        })
        const string = new URLSearchParams(out);
        return string
    }

    search = async (value) => {
        const res =  await Axios.get("/api/photographersearch?" 
            + this.getParamString({
                ...this.state.params,
                user: value
            })
        );
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false
        });
    }

    onStyleChange = async (e) => {
        this.setState({ 
            params: {
                ...this.state.params,
                style: e.target.value
            }, 
            loading: true 
        });
        const res =  await Axios.get("/api/photographersearch?" 
            + this.getParamString({
                ...this.state.params,
                style: e.target.value
            })
        );
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false
        });
    }

    onSortChange = async (e) => {
        this.setState({ 
            params: {
                ...this.state.params,
                activeSort: e.target.value
            }, 
            loading: true 
        });
        const res =  await Axios.get("/api/photographersearch?" 
            + this.getParamString({
                ...this.state.params,
                sort: e.target.value
            })
        );
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false
        });
    }

    onDayTypeChange = async (e) =>{
        this.setState({ 
            params: {
                ...this.state.params,
                dayType: e.target.value
            }, 
            loading: true 
        });
        const res =  await Axios.get("/api/photographersearch?" 
            + this.getParamString({
                ...this.state.params,
                time: e.target.value
            })
        );
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false
        });
    }
    onDateChange = async (date, dateString) => {
        this.setState({ 
            params: {
                ...this.state.params,
                date: formatSnakeDate(date)
            }, 
            loading: true 
        });
        const res =  await Axios.get("/api/photographersearch?" 
            + this.getParamString({
                ...this.state.params,
                date: formatSnakeDate(date)
            })
        );
        this.setState({
            photographers: res.data.results,
            pagination: {
                next: res.data.next,
                prev: res.data.previous
            },
            loading: false
        });
    }
    render() {
        const {photographers, params, loading, pagination} = this.state;
        return (
            <div style={{ marginTop: -64 }}>
                <Parallax
                    blur={{ min: -15, max: 15 }}
                    bgImage={require('assets/banner-background.jpg')}
                    bgImageAlt="photobg"
                    strength={300}
                    className="full-width t-color-white"
                >
                    <div className="container pb-5 pt-5 d-flex align-center" style={{ height: 500 }}>
                        <div className="hero-text">
                            <div className="header">Photo Bro</div>
                            <div className="subheader">Find your photographer</div>
                        </div>
                    </div>
                </Parallax>
                <div className="container mt-5 mb-5">
                    <div className="secondary-label mb-3 pl-0 t-color-default" style={{ textAlign: 'center' }}>
                        Search and Filter
                    </div>
                    <div className="d-flex align-center" style={{ maxWidth: 500, margin: 'auto' }}>
                        <Input.Search 
                            value={params.user} 
                            placeholder="Search" 
                            onChange={e => this.searchPhotographers(e.target.value)} 
                            size="large"
                            className="ma-1"
                        />
                        <DatePicker 
                            type="primary" 
                            size="large" 
                            style={{ minWidth: 120, width: 200 }}
                            onChange={this.onDateChange}
                            format="D/M/YYYY"
                        >
                        </DatePicker>
                    </div>
                    <div className="d-flex align-center justify-center mb-4" style={{ maxWidth: 500, margin: 'auto' }}>
                        <Dropdown overlay={() => (
                            <Form className="pa-3">
                                <Radio.Group 
                                    value={params.style}
                                    onChange={this.onStyleChange} 
                                    className="vertical"
                                >
                                    <Radio 
                                        value=""
                                        style={{display: 'block'}}
                                    >Any</Radio>
                                    { availableStyles.map((e,i) => (
                                        <Radio 
                                            value={e.value} 
                                            key={e.value+i} 
                                            style={{display: 'block'}}
                                        >{e.label}</Radio>
                                    )) }
                                </Radio.Group>
                            </Form>
                            )} 
                            trigger={['click']}
                        >
                            <Button type="primary" size="large" className="mr-1 mb-1 pr-2 pl-3">
                                <span>Styles</span>
                                <Icon type="down" />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={() => (
                            <Form className="pa-3">
                                <Radio.Group 
                                    value={params.activeSort}
                                    onChange={this.onSortChange} 
                                    className="vertical"
                                >
                                    <Radio 
                                        value=""
                                        style={{display: 'block'}}
                                    >None</Radio>
                                    { availableSorts.map((e,i) => (
                                        <Radio 
                                            className="vertical"
                                            value={e.value} 
                                            key={e.value+i} 
                                            style={{display: 'block'}}
                                        >{e.label}</Radio>
                                    )) }
                                </Radio.Group>
                            </Form>
                            )} 
                            trigger={['click']}
                        >
                            <Button type="primary" size="large" className="mr-1 mb-1 pr-2 pl-3">
                                Sort By
                                <Icon type="down" />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={() => (
                            <Form className="pa-3">
                                <Radio.Group 
                                    value={params.dayType}
                                    onChange={this.onDayTypeChange} 
                                    className="vertical"
                                >
                                    <Radio 
                                        value=""
                                        style={{display: 'block'}}
                                    >None</Radio>
                                    { Object.keys(timeLabels).map((e,i) => (
                                        <Radio 
                                            className="vertical"
                                            value={e} 
                                            key={e+"filter"} 
                                            style={{display: 'block'}}
                                        >{timeLabels[e]}</Radio>
                                    )) }
                                </Radio.Group>
                            </Form>
                        )} trigger={['click']}>
                            <Button type="primary" size="large" className="mr-1 mb-1 pr-2 pl-3">
                                Time <Icon type="down" />
                            </Button>
                        </Dropdown>                        
                    </div>
                    <div className="d-flex flex-wrap justify-center align-center">
                        { (!loading) ? 
                            (photographers.length > 0 ? photographers.map((e,i) => (
                                <Card 
                                    user={e}
                                    key={i+e.profile.user.username}
                                />
                            )) : ( 
                            <div className="d-flex align-center justify-center" style={{ height: 400 }}>
                                <div>
                                    <Icon type="search" style={{ fontSize: 60 }} className="t-color-light mb-3"/>
                                    <h3 className="t-color-light">No Results</h3>
                                </div>
                            </div> 
                        )) : (
                            <AntCard
                                className="photographer-card-skeleton"
                            >
                                <Skeleton loading={loading} avatar active>
                                    <Card.Meta
                                    avatar={
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    }
                                    title="Card title"
                                    description="This is the description"
                                    />
                                </Skeleton>
                            </AntCard>
                        )
                    }
                    </div>
                    { (photographers.length > 0 && !loading) && (
                        <div className="d-flex align-center justify-center mt-4">
                            <Button className="ma-1" disabled={!pagination.prev}>
                                <Icon type="left" />
                                Previous
                            </Button>
                            <Button className="ma-1" disabled={!pagination.next}>
                                Next
                                <Icon type="right"/>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})
export default connect(mapStateToProps,null)(Listing);