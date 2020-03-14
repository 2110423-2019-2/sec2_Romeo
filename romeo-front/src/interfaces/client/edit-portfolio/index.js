import React from "react"
import { Redirect } from "react-router-dom";
import { getCurrentClient } from "logic/Client";
import { getPortfolio, uploadPhotos, removePhoto } from "logic/Portfolio";
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
        warnings: [],
        success: false,
        currentClient: null,
        currentPortfolio: null
    }
    componentDidMount() {
        const currentClient = await getCurrentClientInfo();
        const currentPortfolio = getPortfolio(currentClient);
        console.log(currentClient);
        this.setState({
            currentClient,
            currentPortfolio
        });
    }
    handleImageChange = async (e) => {
        const { errors, warnings } = await uploadPhotos(e);
        this.setState({ errors, warnings });
        if (errors.length <= 0 && warnings.length <= 0) {
            this.setState({ success: true });
        }
    };

    deletePhoto = async (key) => {
        await removePhoto(key);
    }

    render() {
        const currentClient = getCurrentClient();
        const currentPortfolio = getPortfolio();
        const { photos } = currentPortfolio;
        const { errors, success, warnings } = this.state;

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
                    { success && (
                        <div className="success-banner">
                            <span>You photos have been successfully uploaded. Please refresh the page to see your new photos.</span>
                        </div>
                    )}
                    { errors && errors.length > 0 ? (
                        errors.map((e,i) => (
                            <div key={"error" + i} className="error-banner">{e.msg ? e.msg : "An error occured."}</div>
                        ))
                    ) : <span/>}
                    { warnings && warnings.length > 0 ? (
                        warnings.map((e,i) => (
                            <div key={"warning" + i} className="warning-banner">{e.msg ? e.msg : "An error occured."}</div>
                        ))
                    ) : <span/>}
                    <input type="file" id="inputfile" accept="image/*" multiple
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
                        { photos.map((e,i) => (
                            <Photo 
                                src={e} 
                                key={e} 
                                index={i}
                                onDelete={() => this.deletePhoto(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default EditPortfolio;