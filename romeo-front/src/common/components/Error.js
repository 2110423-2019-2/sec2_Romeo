import React from "react";
import { connect } from "react-redux";
import { setError } from "../actions/error";
import { Icon, Button } from "antd";

const Error = (props) => {
    const { setError, error } = props;
    return (
        <div className={`snack-bar error ${error ? "active" : ""}`}>
            <div className="container d-flex align-center justify-space-between">
                <div className="d-flex">
                    <Icon type="stop" theme="filled" style={{ fontSize: 20 }}/>
                    { error && (
                        error.detail ? (
                            <h4 className="d-block ml-3 mb-0 t-color-error">
                                {error.detail}.
                            </h4>
                        ) : (
                            <h4 className="d-block ml-3 mb-0 t-color-error">
                                An error occurred. Please try again later.
                            </h4>
                        )
                    )}
                </div>
                <div>
                    <Button 
                        shape="circle" 
                        size="large" 
                        type="danger"
                        onClick={() => setError(null)}
                        className="ml-3"
                    ><Icon type="close" style={{ color: 'white' }}/></Button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    error: state.error.error
})
const mapDispatchToProps = {
    setError
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Error);
