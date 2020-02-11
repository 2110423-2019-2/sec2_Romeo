import React from "react";
import { connect } from "react-redux"; 

class Listing extends React.Component {
    render() {
        const { isAuth } = this.props;
        return (
            <React.Fragment>
                { isAuth || (
                    <div className="full-width bg-primary t-color-white">
                        <div className="container pb-5 pt-5">
                            <h1>Photo Bro</h1>
                            <p className="t-color-white">Slogan here.</p>
                        </div>
                    </div>
                )}
                <div className="container mt-4">
                    <h2>Photographer list will be here.</h2>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})
export default connect(mapStateToProps,null)(Listing);