import React from "react";
import { Card, Tag } from "antd"

const PhotographerCard = (props) => {
    return (
        <Card
            hoverable
            style={{ flexBasis: '40%' }}
            cover={<img alt="cover" src={props.img} />}
            className="ma-2"
        >
            <h1 className="mb-0">{props.name}</h1>
            <span className="d-block mb-1">{props.username}</span>
            <div className="pb-2"/>
            <Tag color="volcano" className="mb-2">
                FASHION
            </Tag>
        </Card>
    )
}

export default PhotographerCard
