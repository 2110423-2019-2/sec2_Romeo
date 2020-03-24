import React from "react";
import { Card, Tag, Icon } from "antd"
import history from "common/router/history";
import { styleColors } from "common/style-colors";

class PhotographerCard extends React.Component {
    state = {
        currentPhoto: 0,
        availablePhotos: []
    }
    mapEquipment = (equipment) => {
        let out = [];
        equipment.forEach(e => {
            out.push(e.equipment_name);
        });
        return out.join(", ");
    }
    getCover = (user) => {
        const { photographer_photos } = user;
        if (photographer_photos.length > 0) {
            return photographer_photos.slice(Math.max(photographer_photos.length - 3, 0))
        } else {
            return []
        }
    }
    componentDidMount() {
        this.setState({
            availablePhotos: this.getCover(this.props.user) 
        });
    }
    render() {
        const { user } = this.props;
        const { availablePhotos, currentPhoto } = this.state;
        return (
            <div 
                className="photographer-card"
                onClick={e => {
                e.stopPropagation();
                history.push("/profile/" + user.profile.user.username)}
            }>
                <Card
                    hoverable
                    cover={
                        availablePhotos.length > 0 ? 
                        <div className="carousel">
                            { availablePhotos.map((e,i) => (
                                <div 
                                    className={`carousel-content ${currentPhoto === i ? "active" : ""}`}
                                    key={e.photo_link + i}
                                    style={{
                                        cursor: "initial"
                                    }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.setState({
                                            currentPhoto: currentPhoto === availablePhotos.length-1
                                                ? 0 : currentPhoto+1
                                        })
                                    }}
                                >
                                    <img src={e.photo_link} alt="cover"/>
                                </div>
                            ))}
                            <div className="carousel-tabs">
                                { availablePhotos.map((e,i) => 
                                    <div 
                                        className="carousel-tab-wrapper" 
                                        key={e.photo_link+"click"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.setState({ currentPhoto: i })
                                        }}
                                    >
                                        <div 
                                            className={`carousel-tab ${currentPhoto === i ? "active" : ""}`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div> :
                        <div className="bg-gray t-color-gray d-flex align-center justify-center" style={{ height: 300 }}>
                            <Icon type="camera" theme="filled" style={{ fontSize: 50 }} />
                        </div>
                    }
                >
                    <div className="d-flex justify-space-between">
                        <h1 
                            className="mb-0"
                        >{user.profile.user.first_name} {user.profile.user.last_name}</h1>
                        {/* { this.props.displayFavButton && (
                            <Button type="danger" size="large" shape="circle" ghost>
                                <Icon type="heart" theme='outlined' />
                            </Button>
                        )} */}
                    </div>
                    <span className="d-block mb-1">{user.profile.user.username}</span>
                    <div className="pb-2"/>
                    { user.photographer_style.length > 0 && (
                        <div>
                            {
                                user.photographer_style.map((e,i) => (
                                    <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                        {e}
                                    </Tag>
                                ))
                            }
                        </div>
                    )}
                    { user.photographer_equipment.length > 0 && (
                        <div>
                            <div className="secondary-label mt-2 pl-0">
                                Equipment
                            </div>
                            <p className="mb-0">
                                <span>{this.mapEquipment(user.photographer_equipment)}</span>
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        )
    }
}

export default PhotographerCard
