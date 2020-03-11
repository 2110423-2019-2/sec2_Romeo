import { SET_AUTH } from "../action-types";
import { setAuthToken, removeAuthToken, setCurrentClient, removeCurrentClient } from "../auth";
import Axios from "axios";

export const signIn = (credentials, history) => async dispatch => {
	try {
		const {
			refresh,
			access
		} = await Axios.post("/auth/jwt/create", credentials);
		setAuthToken(access);

		const {
			user
		} = await Axios.post("/users/" + credentials.username);
		setCurrentClient(credentials.username, user.profile.type);
		dispatch(setAuth(true));
		history.push("/");
	} catch (error) {
		dispatch(setAuth(null));
	}
};

export const signOut = history => dispatch => {
	dispatch(setAuth(null));
	removeAuthToken();
	removeCurrentClient();
	history.push("/");
};

export const setAuth = user => {
	if (user) {
		return {
			type: SET_AUTH,
			payload: {
				isAuth: true
			}
		};
	}
	return {
		type: SET_AUTH,
		payload: {
			isAuth: false
		}
	};
};