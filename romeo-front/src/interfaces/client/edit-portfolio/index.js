import React from "react"
import { Redirect } from "react-router-dom";
import { getCurrentClientInfo } from "common/auth";
import { uploadPhotos, removePhoto } from "logic/Portfolio";
import { Button, Icon } from "antd";
import Photo from "./Photo"


class EditPortfolio extends React.Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
    }
    state = {
        hilights: [],
        errors: [],
        success: false,
        currentClient: null,
        currentPortfolio: null
    }
    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        const currentPortfolio = currentClient.photographer_photos
        this.setState({
            currentClient,
            currentPortfolio
        });
    }
    handleImageChange = async (e) => {
        const { currentClient } = this.state;
        const { errors } = await uploadPhotos(e, currentClient.profile.user.username, currentClient.photographer_photos);
        this.setState({ errors });
    };

    deletePhoto = async (key) => {
        const { currentClient, currentPortfolio } = this.state;
        await removePhoto(key, currentPortfolio , currentClient.profile.user.username);
    }

    render() {
        const { errors, currentClient, currentPortfolio } = this.state;

        if (currentClient && currentClient.profile.user.user_type !== 1) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <div className="container mt-4 with-sidebar pl-4">
                    <h1>Edit Portfolio</h1>
                    <p>
                        Upload and remove photos from your portfolio. <br/>
                        <small className="t-color-light">Maximum file size: 2MB</small>
                    </p>
                    { errors && errors.length > 0 ? (
                        errors.map((e,i) => (
                            <div key={"error" + i} className="error-banner">{e.msg ? e.msg : "An error occured."}</div>
                        ))
                    ) : <span/>}
                    <input type="file" id="inputfile" accept="image/*"
                        onChange={this.handleImageChange} hidden ref={this.uploadRef}/>
                    <Button 
                        type="primary" 
                        onClick={() => this.uploadRef.current.click()}
                        className="el-4 pos-fixed"
                        size="large"
                        shape="round"
                        style={{
                            right: 36,
                            bottom: 24,
                            transform: 'scale(1.2)',
                            zIndex: 999
                        }}
                    >
                        <Icon type="upload" /> Upload
                    </Button>
                    <br/>
                </div>
                <div className="container with-sidebar full-width-xs portfolio-container">
                    <div className="photo-grid">
                        { currentPortfolio && currentPortfolio.map((e,i) => (
                            <Photo 
                                src={e.photo_link} 
                                key={e.photo_link} 
                                index={i}
                                onDelete={() => this.deletePhoto(i, currentPortfolio)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default EditPortfolio;