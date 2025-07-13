import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { DestinationProvider } from "../context/Destination-context.jsx";
import { OrderProvider } from "../context/Order-context.jsx";
import HeaderComponent from "../components/Header-component.jsx";
import HomePage from "../pages/Home-page.jsx";
import MerchantPage from "../pages/Merchant-page.jsx";
import MapPage from "../pages/Map-page.jsx";
import AddressPage from "../pages/Address-page.jsx";
import UpdateAddressPage from "../pages/Update-address-page.jsx";
import LoginPage from "../pages/Login-page.jsx";
import RegisterPage from "../pages/Register-page.jsx";
import ProfilePage from "../pages/Profile-page.jsx";
import ProgressPage from "../pages/Progress-page.jsx";

const UserRoutes = () => {
	const Auth = () => {
		const token = localStorage.getItem("token");
		const [loading, setLoading] = useState(true);
		const location = useLocation();

		useEffect(() => {
			setLoading(false);
		}, []);

		if (loading) {
			return "Mengautentikasi . . .";
		}

		let role = null;
		if (token) {
			try {
				role = jwtDecode(token)?.role;
			} catch (error) {
				console.error(error);
				return;
			}
		}

		if (!token || role !== "user") {
			return <Navigate to="/login" state={{ from: location }} replace />;
		}

		return <Outlet />;
	};

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

	const ContextGroup = () => {
		return (
			<DestinationProvider>
			<OrderProvider>
			<Outlet />
			</OrderProvider>
			</DestinationProvider>
			)
	}

	return (
		<Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		
		<Route element={<ContextGroup />}>
		<Route element={<WithHeader />}>
		<Route path="/" element={<HomePage />} />
		<Route path="/menu/:id_merchant" element={<MerchantPage />} />
		</Route>
		<Route path='/map' element={<MapPage />} />
		<Route path='/map/address' element={<AddressPage />} />
		<Route path='/address/:id_address' element={<UpdateAddressPage />} />
		</Route>
		
		<Route element={<Auth />}>
		<Route path="/profile" element={<ProfilePage />} />
		<Route element={<ContextGroup />}>
		<Route path="/progress" element={<ProgressPage />} />
		</Route>
		</Route>

		{/*NOT FOUND PAGE*/}
		<Route path='*' element={'Page Not Found'} />
		</Routes>
		);
};

export default UserRoutes;
