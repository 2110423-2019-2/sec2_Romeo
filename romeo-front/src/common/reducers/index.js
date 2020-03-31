import { combineReducers } from "redux";
import auth from "./auth";
import error from "./error";
import editProfile from "interfaces/client/edit-profile/reducer"

export default combineReducers({
	auth,
	error,
	editProfile
});