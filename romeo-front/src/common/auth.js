import Axios from "axios";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};

export const setCurrentUser = (user) => {
	localStorage.setItem("currentUser", JSON.stringify(user));
};

export const removeCurrentUser = () => {
	localStorage.removeItem("currentUser");
};