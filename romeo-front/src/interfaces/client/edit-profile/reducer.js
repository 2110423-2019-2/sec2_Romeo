import { SET_CURRENT_EQUIPMENT, 
    SET_CURRENT_STYLES, 
    SET_CURRENT_AVAILTIMES,
    SET_FIELD_ERRORS
} from "common/action-types";

const initialState = {
    currentEquipment: [],
    currentStyles: [],
    currentAvailTimes: [{
        day: "MONDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "TUESDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "WEDNESDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "THURSDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "FRIDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "SATURDAY",
        time: "NOT_AVAILABLE"
    },{
        day: "SUNDAY",
        time: "NOT_AVAILABLE"
    }],
    fieldErrors: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_CURRENT_EQUIPMENT:
			return {
				...state,
				currentEquipment: payload.currentEquipment
            };
        case SET_CURRENT_STYLES:
            return {
                ...state,
                currentStyles: payload.currentStyles
            };
        case SET_CURRENT_AVAILTIMES:
            return {
                ...state,
                currentAvailTimes: payload.currentAvailTimes
            }
        case SET_FIELD_ERRORS:
            return {
                ...state,
                fieldErrors: payload.errors
            }
		default: return state;
	}
};
