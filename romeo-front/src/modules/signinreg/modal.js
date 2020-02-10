import React from 'react';
import { Modal } from "antd";
import SignIn from "./SignIn";

class SignInRegModal extends React.Component {
    render() {
        const { visible, onCancel } = this.props;

        return (
            <Modal 
                visible={visible} 
                onCancel={onCancel}
                footer={null}
            >
                <SignIn />
            </Modal>
        )
    }
}

export default SignInRegModal;