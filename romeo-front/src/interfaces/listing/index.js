import React from "react";
import { connect } from "react-redux"; 
import { Parallax } from 'react-parallax';
import Card from "./Card";
import Axios from "axios";
import { Input, Skeleton, Card as AntCard, Avatar, Icon, Dropdown, Form, Radio, Button, Menu, DatePicker} from "antd";
import { getCurrentClientInfo } from "common/auth";
import { availableStyles } from "logic/availableStyles"

class Listing extends React.Component {

    state = {
        photographers: [],
        currentClient: null,
        typing: false,
        typingTimeout: 0,
        activeSort: "none",
        params: {
            user: "",
            style: ""
        }
    }

    componentDidMount = async () => {
        this.setState({ loading: true })
        const res =  await Axios.get("/api/photographersearch");
        const currentClient = await getCurrentClientInfo();
        this.setState({
            photographers: res.data,
            currentClient,
            loading: false
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
            photographers: res.data,
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
            photographers: res.data,
            loading: false
        });
    }

    onSortChange(newSort){
        this.setState({ activeSort: newSort});
    }

    render() {
        const {photographers, params, loading} = this.state;
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
                        Search by Name or Filter by Style
                    </div>
                    <div className="d-flex align-center mb-4" style={{ maxWidth: 500, margin: 'auto' }}>
                        <Input.Search 
                            value={params.user} 
                            placeholder="Search" 
                            onChange={e => this.searchPhotographers(e.target.value)} 
                            size="large"
                            className="ma-1"
                        />
                        <div>
                            <div className="d-flex">
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
                                )} trigger={['click']}>
                                    <Button type="primary" size="large" className="ma-1 pr-2">
                                        <span>Styles</span>
                                        <Icon type="down" />
                                    </Button>
                                </Dropdown>
                                <Button.Group className="d-flex">
                                    <Dropdown overlay={() => (
                                        <Menu>
                                            <Menu.Item 
                                                onClick={() => this.onSortChange("none")}
                                            >None</Menu.Item>
                                            <Menu.Item 
                                                onClick={() => this.onSortChange("price")}
                                            >Price</Menu.Item>
                                            <Menu.Item 
                                                onClick={() => this.onSortChange("rating")}
                                            >Rating</Menu.Item>
                                        </Menu>
                                    )} trigger={['click']}>
                                        <Button type="primary" size="large" className="pl-3 pr-2 ma-1 mr-0">
                                            Sort By
                                        </Button>
                                    </Dropdown>
                                    <Dropdown overlay={() => (
                                        <Menu>
                                            <Menu.Item onClick={() => {}}>Highest First</Menu.Item>
                                            <Menu.Item onClick={() => {}}>Lowest First</Menu.Item>
                                        </Menu>
                                    )} trigger={['click']}>
                                        <Button type="primary" size="large" className="pl-1 pr-2 ma-1 ml-0">
                                            <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </Button.Group> 
                            </div>
                            <Button.Group className="d-flex ma-1" style={{ maxWidth: 500}}>
                                <DatePicker type="primary" size="large" style={{ minWidth: 125}}
                                >
                                </DatePicker>
                                <Dropdown overlay={() => (
                                    <Menu>
                                        <Menu.Item onClick={() => {}}>Half Day</Menu.Item>
                                        <Menu.Item onClick={() => {}}>Full Day</Menu.Item>
                                    </Menu>
                                )} trigger={['click']}>
                                    <Button type="primary" size="large" className="pl-1 pr-2 ml-0">
                                        <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </Button.Group>                            
                        </div>
                        
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})
export default connect(mapStateToProps,null)(Listing);