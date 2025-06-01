import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../context/Login-context.jsx";
import { reqLogin } from "../api.jsx";

const LoginPage = () => {
	const [username, setUsername] = useState("andika_fahri");
	const [password, setPassword] = useState("andika5A");
	const navigate = useNavigate();
	const { setToken } = useContext(LoginContext);
	const location = useLocation()
	const from = location.state?.from?.pathname || ''

	const handleLogin = (e) => {
		e.preventDefault();
		reqLogin(username, password)
		.then((result) => {
			console.log(result);
			localStorage.setItem("token", result.data.token);
			setToken(result.data.token);
			if(from == '/login' || !from){
				navigate('/');
			}else{
				navigate(from, {replace: true})
			}
		})
		.catch((error) => {
			console.log(error.response.data.errors);
		});
	};

	return (
		<>
		<form onSubmit={handleLogin}>
		<input
		type="text"
		value={username}
		placeholder="Username"
		onChange={(e) => setUsername(e.target.value)}
		required
		/>
		<input
		type="text"
		value={password}
		placeholder="Password"
		onChange={(e) => setPassword(e.target.value)}
		required
		/>
		<button type="submit" style={{ fontSize: "2rem" }}>
		LOGIN
		</button>
		</form>
		</>
		);
};

export default LoginPage;
