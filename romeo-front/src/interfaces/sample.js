import React from "react";
import { Button } from 'antd';
import Sample2 from "./sample2";

class Sample extends React.Component {
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    componentDidUpdate() {

    }

    state = {
        firstName: 'Plakim',
        lastName: 'Prawsang',
        text: "Lorem Ipsum",
        bio: ""
    }

    render() {
        const { firstName, lastName, text, bio } = this.state;
        return (
            <React.Fragment>
                <Sample2 firstName={firstName} lastName={lastName} />
                <h1>Text: {text}</h1>
                <Button 
                    onClick={() => this.setState({ 
                        text: 'Jane', 
                        firstName: 'Janejira'
                    })}
                >
                    Set Jane
                </Button>
                <textarea onChange={e => this.setState({ bio: e.target.value})} value={bio}>

                </textarea>
                <h3>Bio</h3>
                <p>{bio}</p>
            </React.Fragment>
        )
    }
}

export default Sample;