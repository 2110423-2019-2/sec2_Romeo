import React from "react";
import { Card, Tag } from "antd"

const PhotographerCard = (props) => {
    return (
        <Card
            hoverable
            style={{ flexBasis: '80%' }}
            cover={<img alt="cover" src={props.img} />}
        >
            <h1 className="mb-1">{props.name}</h1>
            <span className="d-block mb-1">{props.username}</span>
            <Tag color="volcano" className="mb-2">
                FASHION
            </Tag>
        </Card>
    )
}

export default PhotographerCard
