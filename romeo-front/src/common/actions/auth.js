import { SET_AUTH } from "../action-types";
import { setAuthToken, removeAuthToken, setCurrentUser, removeCurrentUser } from "../auth";
import Axios from "axios";

// export const signIn = (credentials, history) => async dispatch => {
// 	try {
// 		const {
// 			data: { user }
// 		} = await Axios.post("/user/signIn", credentials);
// 		setAuthToken(user.token);
// 		setCurrentUser(user.id, user.username);
// 		dispatch(setAuth(true));
// 		history.push("/");
// 	} catch (error) {
// 		dispatch(setAuth(null));
// 	}
// };

export const signIn = (credentials, history) => async dispatch => {
	// TODO: sign in using backend, wait for backend to return token and user information
	// User information is now only mock data
	setCurrentUser(credentials);
	setAuthToken(credentials.username); // TODO: user backend token
	dispatch(setAuth(true));
	if (credentials.type = "PHOTOGRAPHER") {
		history.push("/profile/" + credentials.username);
	} else {
		history.push("/");
	}
};

export const signOut = history => dispatch => {
	dispatch(setAuth(null));
	removeAuthToken();
	removeCurrentUser();
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