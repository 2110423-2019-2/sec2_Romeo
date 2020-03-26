import moment from "moment";

export const formatDate = date => {
	if (!date || date === "") return "-";
	return moment(date).format("D/M/YYYY");
};

export const formatDashedDate = date => {
	if (!date || date === "") return "-";
	return moment(date).format("YYYY-MM-DD");
};

export const formatDateTime = date => {
	if (!date || date === "") return "-";
	return moment(date).format("D/M/YYYY HH:mm");
};

export const dashedDateTime = date => {
	if (!date || date === "") return null;
	return moment(date).format("YYYY-MM-DD HH:mm");
};