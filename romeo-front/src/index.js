import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import 'normalize.css/normalize.css';
import './assets/index.css';
import AppRouter from "./common/router/router";
import store from "./common/store.js";
import initHttp from "./common/http.js";
import { setAuth } from "./common/actions/auth";
import * as serviceWorker from './serviceWorker';
import { removeCurrentClient, setCurrentClient } from 'common/auth';
import { getCurrentClient, mockValues } from 'logic/Client';

initHttp();

const token = localStorage.getItem("token");
if (token) {
	store.dispatch(setAuth(true));
	if (!getCurrentClient()) {
		setCurrentClient(mockValues);
	}
} else {
	store.dispatch(setAuth(false));
	removeCurrentClient();
}

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
