import Axios from "axios";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};

export const setCurrentUser = (id, type) => {
	localStorage.setItem("userId", id);
	localStorage.setItem("userType", type);
};

export const removeCurrentUser = () => {
	localStorage.removeItem("userId");
};