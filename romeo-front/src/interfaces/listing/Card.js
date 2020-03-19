import React from "react";
import { Card, Tag, Button, Icon } from "antd"
import history from "common/router/history";
import { styleColors } from "common/style-colors";

const mapEquipments = (equipment) => {
    let out = [];
    equipment.forEach(e => {
        out.push(e.equipment_name);
    });
    return out.join(", ");
}

const getCover = (user) => {
    const { photographer_photos } = user;
    if (photographer_photos.length > 0) {
        return photographer_photos[photographer_photos.length-1].photo_link
    } else {
        return null
    }
}

const PhotographerCard = (props) => {
    return (
        <Card
            hoverable
            style={{ flexBasis: '40%', margin: '2%' }}
            cover={
                props.user.photographer_photos.length > 0 ? 
                <img src={getCover(props.user)} alt="cover"/> :
                <div className="bg-gray t-color-gray d-flex align-center justify-center" style={{ height: 300 }}>
                    <Icon type="camera" theme="filled" style={{ fontSize: 50 }} />
                </div>
            }
            onClick={() => history.push("/profile/" + props.user.profile.user.username)}
        >
            <div className="d-flex justify-space-between">
                <h1 className="mb-0">{props.user.profile.user.first_name} {props.user.profile.user.last_name}</h1>
                { props.displayFavButton && (
                    <Button type="danger" size="large" shape="circle" ghost>
                        <Icon type="heart" theme='outlined' />
                    </Button>
                )}
            </div>
            <span className="d-block mb-1">{props.user.profile.user.username}</span>
            <div className="pb-2"/>
            { props.user.photographer_style.length > 0 && (
                <div className="mb-2">
                    {
                        props.user.photographer_style.map((e,i) => (
                            <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                {e}
                            </Tag>
                        ))
                    }
                </div>
            )}
            { props.user.photographer_equipment.length > 0 && (
                <div>
                    <div className="secondary-label mb-2 pl-0">
                        Equipment
                    </div>
                    <p className="mb-0">
                        <span>{mapEquipments(props.user.photographer_equipment)}</span>
                    </p>
                </div>
            )}
        </Card>
    )
}

export default PhotographerCard
