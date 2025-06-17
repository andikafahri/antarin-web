import {useContext, useState, useEffect} from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	useMatch,
	Outlet,
	Navigate
} from "react-router-dom";
// import {jwtDecode} from 'jwt-decode'
import "./App.css";
import { SocketProvider } from "./context/Socket-context.jsx";
import { LoginProvider } from "./context/Login-context.jsx";
import { LoginContext} from './context/Login-context.jsx'
import { AlertProvider } from "./context/Alert-context.jsx";
import UserRoutes from './route/User-routes.jsx'
import MerchantRoutes from './route/Merchant-routes.jsx'

const Content = () => {
	return(
		<Routes>
		{/*USER ROUTES*/}
		<Route path='/*' element={<UserRoutes />} />

		{/*MERCHANT ROUTES*/}
		<Route path='/merchant/*' element={<MerchantRoutes />} />
		
		{/*NOT FOUND PAGE*/}
		<Route path='*' element={'Page Not Found'} />
		</Routes>
		)
}

const App = () => {
	return (
		<Router>
		<LoginProvider>
		<SocketProvider>
		<AlertProvider>
		<Content />
		</AlertProvider>
		</SocketProvider>
		</LoginProvider>
		</Router>
		);
};

export default App;
