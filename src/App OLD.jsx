import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	useMatch,
} from "react-router-dom";
import { LoginProvider } from "./context/Login-context.jsx";
import { AlertProvider } from "./context/Alert-context.jsx";
import { DestinationProvider } from "./context/Destination-context.jsx";
import { CartProvider } from "./context/Cart-context.jsx";
import LoginPage from "./pages/Login-page.jsx";
import HeaderComponent from "./components/Header-component.jsx";
import HomePage from "./pages/Home-page.jsx";
import MerchantPage from "./pages/Merchant-page.jsx";

const Content = () => {
	const location = useLocation();

	let showHeader = false;
	const allowedPath = ["/"].includes(location.pathname);
	const notAllowedPath = ["/login"].includes(location.pathname);
	const matchMerchant = useMatch("/:id_merchant");

	if (allowedPath || (matchMerchant && !notAllowedPath)) {
		// if(['/'].includes(location.pathname)){
		showHeader = true;
	}

	if (notAllowedPath) {
		showHeader = false;
	}

	return (
		<>
			<LoginProvider>
				<AlertProvider>
					<DestinationProvider>
						{showHeader && <HeaderComponent />}
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route
								path="/:id_merchant"
								element={
									<CartProvider>
										<MerchantPage />
									</CartProvider>
								}
							/>
							<Route path="/login" element={<LoginPage />} />
							{/*<Route path='*' element={<MerchantPage />} />*/}
						</Routes>
					</DestinationProvider>
				</AlertProvider>
			</LoginProvider>
		</>
	);
};

const App = () => {
	return (
		<Router>
			<Content />
		</Router>
	);
};

export default App;
