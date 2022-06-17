import React from "react";
import './App.css';
import Router from './Routes/routing';
import { store } from "./redux/store";
import { Provider } from "react-redux";


const App = () => {
	return (
		<Provider store={store}>
			<Router />
		</Provider>
	);
};
export default App;
