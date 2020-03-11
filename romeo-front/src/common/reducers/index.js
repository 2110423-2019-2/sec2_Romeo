import { combineReducers } from "redux";
import auth from "./auth";
import editProfile from "interfaces/client/edit-profile/reducer"

export default combineReducers({
	auth,
	editProfile
});