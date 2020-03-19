import React from "react";
import { Button, Input, Icon, Form } from "antd";
import { connect } from "react-redux";
import { setCurrentEquipment } from "./actions";

class Equipment extends React.Component {
    state = {
        equipmentName: ""
    }
    componentDidMount() {
        const { currentClient } = this.props;
        const equipment = currentClient.photographer_equipment;
        this.props.setCurrentEquipment(equipment);
    }
    addEquipment = () => {
        const { equipmentName } = this.state;
        const { currentEquipment, setCurrentEquipment } = this.props;
        if (equipmentName.length > 0) {
            setCurrentEquipment([...currentEquipment, {
                equipment_name: equipmentName
            }])
        }
    }
    deleteEquipment = key => {
        let { currentEquipment, setCurrentEquipment } = this.props;
        setCurrentEquipment([
            ...currentEquipment.slice(0,key),
            ...currentEquipment.slice(key+1,currentEquipment.length)])
    }
    render() {
        const { currentEquipment } = this.props;
        const { equipmentName } = this.state;
        return (
            <React.Fragment>
                <h3>Equipment</h3>
                <Form className="d-flex">
                    <Form.Item className="mr-2 mb-0 full-width">
                        <Input
                            placeholder="Equipment Name"
                            type="text"
                            value={equipmentName}
                            onChange={(e) => this.setState({ equipmentName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            onClick={(() => this.addEquipment())}
                            htmlType="submit" 
                        >
                            <Icon type="plus" />
                            Add Equipment
                        </Button>
                    </Form.Item>
                </Form>
                <h4>Current Equipment</h4>
                { currentEquipment.length > 0 ? (
                    currentEquipment.map((e,i) => (
                        <div 
                            className="snippet"
                            key={"equip" + i}
                        >
                            <b>{e.equipment_name}</b>
                            <Button type="danger" onClick={() => this.deleteEquipment(i)}>
                                <Icon type="delete"/>
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="t-color-light">You haven't added any equipment.</p>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    currentEquipment: state.editProfile.currentEquipment
})
const mapDispatchToProps = {
    setCurrentEquipment
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Equipment);