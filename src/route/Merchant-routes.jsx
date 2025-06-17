import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../pages/merchant-app/Login-page.jsx";
import HeaderComponent from "../components/merchant-app/Header-component.jsx";
import DashboardPage from "../pages/merchant-app/Dashboard-page.jsx";
import ProfilePage from "../pages/merchant-app/Profile-page.jsx";
import MenuPage from "../pages/merchant-app/Menu-page.jsx";

const MerchantRoutes = (token) => {
	const Auth = () => {
		const [loading, setLoading] = useState(true);
		const location = useLocation();

		useEffect(() => {
			setLoading(false);
		}, []);

		if (loading) {
			return "Mengautentikasi . . .";
		}

		if (!token) {
			return <Navigate to="/login" state={{ from: location }} replace />;
		}

		return <Outlet />
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

	return (
		<Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route element={<Auth />}>
		<Route element={<WithHeader />}>
		<Route path="/dashboard" element={<DashboardPage />} />
		<Route path="/menu" element={<MenuPage />} />
		</Route>
		<Route path="/profile" element={<ProfilePage />} />
		</Route>
		<Route path="*" element={"Page Not Found"} />
		</Routes>
		);
};

export default MerchantRoutes;
