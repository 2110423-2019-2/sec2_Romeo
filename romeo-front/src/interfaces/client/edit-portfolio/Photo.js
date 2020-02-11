import React from "react";
import { Button, Icon } from "antd";

class Photo extends React.Component {
    render() {
        const { src, className, onDelete } = this.props;
        return (
            <div className="photo-grid-photo">
                {/* <Button 
                    type="danger" 
                    shape="circle"
                    size="large"
                    className="pos-absolute del-button"
                    onClick={onDelete}
                >
                    <Icon type="delete"/>
                </Button> */}
                <img src={src} alt="" className={className} />
            </div>
        )
    }
}

export default Photo