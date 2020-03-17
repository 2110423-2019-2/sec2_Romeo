import React from "react";
import { connect } from "react-redux"; 
import { Parallax } from 'react-parallax';
import Card from "./Card";
import Axios from "axios";

class Listing extends React.Component {

    state = {
        photographers: []
    }

    componentDidMount = async () => {
        const res =  await Axios.get("/api/photographers/")
        this.setState({
            photographers: res.data
        });
        // Axios.get("/api/photographers").then(res => {
        //     this.setState({ photographers: res.data });
        // })
    }

    render() {
        const {photographers} = this.state;
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
                <div className="container mt-4">
                    <div className="d-flex flex-wrap justify-center">
                        { photographers.map((e,i) => (
                            <Card 
                                user={e}
                                img="https://photobro.sgp1.digitaloceanspaces.com/prawsang1581927571694-0.jpg"
                                key={i+e.profile.user.username}
                            />
                        ))
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