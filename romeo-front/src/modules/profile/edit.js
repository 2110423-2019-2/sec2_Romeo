import React from 'react';
import history from "../../common/router/history";

class Edit extends React.Component {
    state = {
        firstName: ""
    }
    render() {
        const { firstName } = this.state;
        return (
            <React.Fragment>
                <h1>Edit Profile</h1>
                <form>
                    <label>First Name</label>
                    <input 
                        value={firstName} 
                        onChange={e => this.setState({ firstName: e.target.value })}
                        placeholder="First Name"
                    />
                </form>
                <button onClick={() => history.push("/profile")}>Confirm</button>
                <button onClick={() => history.push("/profile")}>Back</button>
            </React.Fragment>
        )
    }
}

export default Edit;