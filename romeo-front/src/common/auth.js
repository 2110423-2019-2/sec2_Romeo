import Axios from "axios";
import { editCurrentClient } from "logic/Client";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};

export const setCurrentClient = (client) => {
	editCurrentClient(client);
};

export const removeCurrentClient = () => {
	localStorage.removeItem("currentClient");
};