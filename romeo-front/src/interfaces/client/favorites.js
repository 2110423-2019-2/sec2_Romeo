import React from "react";
import { getCurrentClient } from "common/auth";
import history from "common/router/history";
import Axios from "axios";
import { Card as AntCard, Icon, Skeleton, Avatar } from "antd";
import Card from "../listing/Card";

class Favorites extends React.Component {
    state = {
        photographers: [],
        loading: false
    }
    componentDidMount = async () => {
        try {
            const username = getCurrentClient().username;
            this.setState({ loading: true });
            const res = await Axios.get("/api/getfavphotographers/" + username);
            this.setState({ loading: false });
            if (res.data) {
                this.setState({
                    photographers: res.data.fav_photographers
                })
            }
        } catch (err) {
            console.log(err);
            history.push("/client");
        }
    }

    render() {
        const { photographers, loading } = this.state;
        return (
            <div className="container mt-4 with-sidebar pl-4">
                <div className="d-flex flex-wrap justify-center align-center">
                    { (!loading) ? 
                        (photographers.length > 0 ? photographers.map((e,i) => (
                            <Card 
                                user={e}
                                key={i+e.profile.user.username}
                            />
                        )) : ( 
                        <div className="d-flex align-center justify-center" style={{ height: 400 }}>
                            <div style={{ textAlign: 'center' }}>
                                <Icon type="heart" style={{ fontSize: 40 }} className="t-color-light mb-3"/>
                                <p className="t-color-light">You do not have any favorite photographers.</p>
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
        )
    }
}

export default Favorites;