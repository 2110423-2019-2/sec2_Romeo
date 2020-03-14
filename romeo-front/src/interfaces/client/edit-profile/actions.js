import { 
    SET_CURRENT_EQUIPMENT, 
    SET_CURRENT_STYLES, 
    SET_CURRENT_AVAILTIMES,
    SET_FIELD_ERRORS
} from "common/action-types";

export const setCurrentEquipment = currentEquipment => ({
    payload: {
        currentEquipment
    },
    type: SET_CURRENT_EQUIPMENT
});

export const setCurrentStyles = currentStyles => ({
    payload: {
        currentStyles
    },
    type: SET_CURRENT_STYLES
});

export const setCurrentAvailTimes = currentAvailTimes => ({
    payload: {
        currentAvailTimes
    },
    type: SET_CURRENT_AVAILTIMES
});

export const setFieldErrors = errors => ({
    payload: {
        errors
    },
    type: SET_FIELD_ERRORS
})