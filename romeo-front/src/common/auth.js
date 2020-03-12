import Axios from "axios";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};

export const setCurrentClient = (username, type) => {
	console.log(username);
	localStorage.setItem("currentClient", JSON.stringify({username, type }));
};

export const getCurrentClient = () => {
	return JSON.parse(localStorage.getItem("currentClient"));
}

export const getCurrentClientInfo = async () => {
	const currentClient = getCurrentClient()
	if (currentClient) {
		if (currentClient.type === 1) {
			const info = await Axios.get(`/api/photographers/${currentClient.username}`);
			return info.data;
		} else {
			const info = await Axios.get(`/api/customers/${currentClient.username}`);
			return info.data;
		}
	} else {
		return null
	}
}

export const removeCurrentClient = () => {
	localStorage.removeItem("currentClient");
};