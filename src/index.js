import React from "react";
import ReactDOM from "react-dom";
import { routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import App from "./components/App";
import config from "./config";
import createRootReducer from "./reducers";
import { doInit } from "./actions/auth";
import initFacebookSDK from "./fbSDK/initFacebookSDK";
import { createHashHistory } from "history";

const history = createHashHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function getHistory() {
  return history;
}

axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common["Content-Type"] = "application/json";
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

axios.interceptors.response.use(undefined, function (error) {
  if (error.response?.status === 401) {
    window.location.href = "/logout";
  } else {
    return Promise.reject(error);
  }
});

export const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(routerMiddleware(history), ReduxThunk))
);
store.dispatch(doInit());

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
};

initFacebookSDK().then(() => {
  renderApp();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
