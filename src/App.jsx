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
import "./App.css";
import { LoginProvider } from "./context/Login-context.jsx";
import { LoginContext} from './context/Login-context.jsx'
import { AlertProvider } from "./context/Alert-context.jsx";
import { DestinationProvider } from "./context/Destination-context.jsx";
import { OrderProvider } from "./context/Order-context.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import HeaderComponent from "./components/Header-component.jsx";
import HomePage from "./pages/Home-page.jsx";
import MerchantPage from "./pages/Merchant-page.jsx";
import ProfilePage from "./pages/Profile-page.jsx";
import ProgressPage from './pages/Progress-page.jsx'

const Auth = ({children, token}) => {
	// const {token} = useContext(LoginContext)
	const [loading, setLoading] = useState(true)
	const location = useLocation()
	
	useEffect(() => {
		setLoading(false)
	}, [])

	if(loading){
		return 'Mengautentikasi . . .'
	}

	if(!token){
		return <Navigate to='/login' state={{from: location}} replace />
	}

	return children
}

const WithHeader = () => {
	return (
		<>
		<HeaderComponent />
		<main>
		<Outlet />
		</main>
		</>
		);
};

const Content = () => {
	const {token} = useContext(LoginContext)
	return(
		<Routes>
		{/*<Route element={<Auth token={token}><WithHeader /></Auth>}>*/}
		<Route element={<WithHeader />}>
		<Route path="/" element={<HomePage />} />
		<Route path="/:id_merchant" element={<MerchantPage />} />
		</Route>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		<Route path='/profile' element={<Auth token={token}><ProfilePage /></Auth>} />
		<Route path='/progress' element={<Auth token={token}><ProgressPage /></Auth>} />
					{/*<Route path='*' element={<MerchantPage />} />*/}
		</Routes>
		)
}

const App = () => {
	return (
		<Router>
		<LoginProvider>
		<AlertProvider>
		<DestinationProvider>
		<OrderProvider>
		<Content />
		</OrderProvider>
		</DestinationProvider>
		</AlertProvider>
		</LoginProvider>
		</Router>
		);
};

export default App;
