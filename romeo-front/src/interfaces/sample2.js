import React from "react"

const Sample2 = (props) => {
    const { firstName, lastName } = props;
    return (
        <React.Fragment>
            <div className="d-flex align-center pa-5 bg-primary-light t-color-default">
                <h1 className="mr-4">First Name: {firstName}</h1>
                <h2>Last Name: {lastName}</h2>
            </div>
        </React.Fragment>
    );
}

export default Sample2;