import { SET_AUTH } from "../action-types";

const initialState = {
	isAuth: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_AUTH:
			return {
				...state,
				isAuth: payload.isAuth
			};
		default: return state;
	}
};