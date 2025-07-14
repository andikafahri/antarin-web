import {useContext, useState, useEffect, Suspense, lazy} from 'react'
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
// import UserRoutes from './route/User-routes.jsx'
// import MerchantRoutes from './route/Merchant-routes.jsx'

const UserRoutes = lazy(() => import('./route/User-routes.jsx'))
const MerchantRoutes = lazy(() => import('./route/Merchant-routes.jsx'))

const FaviconUpdater = () => {
	const location = useLocation()

	useEffect(() => {
		const favicon = document.querySelector("link[rel~='icon']")

		if(location.pathname.startsWith('/merchant')){
			favicon.href = '/img/Favicon Merchant.png'
		}else{
			favicon.href = '/img/Favicon.png'
		}
	}, [location])

	return null
}

const Content = () => {
	return(
		<Suspense fallback={<div>Memuat . . .</div>}>
		<Routes>
		{/*USER ROUTES*/}
		<Route path='/*' element={<UserRoutes />} />

		{/*MERCHANT ROUTES*/}
		<Route path='/merchant/*' element={<MerchantRoutes />} />
		
		{/*NOT FOUND PAGE*/}
		<Route path='*' element={'Page Not Found'} />
		</Routes>
		</Suspense>
		)
}

const App = () => {
	return (
		<Router>
		<FaviconUpdater />
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
