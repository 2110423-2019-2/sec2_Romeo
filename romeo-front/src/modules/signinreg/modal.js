import React from 'react';
import { Modal, Tabs } from "antd";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const { TabPane } = Tabs;

class SignInRegModal extends React.Component {
    render() {
        const { visible, onCancel, defaultActive } = this.props;

        return (
            <Modal 
                visible={visible} 
                onCancel={onCancel}
                footer={null}
            >
                <Tabs defaultActiveKey={defaultActive}>
                    <TabPane tab="Sign In" key="1">
                        <SignIn />
                    </TabPane>
                    <TabPane tab="Sign Up" key="2">
                        <SignUp />
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }
}

export default SignInRegModal;