import React from "react";
import { connect } from "react-redux"; 
import { Parallax } from 'react-parallax';
import Card from "./Card";
import Axios from "axios";
import { Input, Skeleton, Card as AntCard, Avatar, Icon } from "antd";
import { getCurrentClientInfo } from "common/auth";

class Listing extends React.Component {

    state = {
        photographers: [],
        currentClient: null,
        search: "",
        typing: false,
        typingTimeout: 0
    }

    componentDidMount = async () => {
        const res =  await Axios.get("/api/photographers/")
        const currentClient = await getCurrentClientInfo();
        this.setState({
            photographers: res.data,
            currentClient
        });
    }

    searchPhotographers = async (value) => {
        this.setState({ loading: true });

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            search: value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.search(value);
            }, 3000)
         });
    }

    search = async (value) => {
        const res =  await Axios.get("/api/photographers?search=" + value)
        this.setState({
            photographers: res.data,
            loading: false
        });
    }

    render() {
        const {photographers, currentClient, search, loading, typing} = this.state;
        const { isAuth } = this.props;
        console.log(loading);
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
                <div className="container mt-4 mb-5">
                    <div className="d-flex align-center" style={{ maxWidth: 500, margin: 'auto' }}>
                        <Input.Search 
                            value={search} 
                            placeholder="Search" 
                            onChange={e => this.searchPhotographers(e.target.value)} 
                            size="large"
                        />
                    </div>
                    <div className="d-flex flex-wrap justify-center">
                        { (!loading) ? 
                            (photographers.length > 0 ? photographers.map((e,i) => (
                                <Card 
                                    user={e}
                                    key={i+e.profile.user.username}
                                    displayFavButton={
                                        !isAuth || (currentClient && currentClient.profile.user.user_type !== 1)
                                    }
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
                                style={{ flexBasis: '40%', margin: '2%', height: 400 }}
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