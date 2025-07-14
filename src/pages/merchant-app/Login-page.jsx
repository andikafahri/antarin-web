import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {Helmet} from 'react-helmet'
import loginStyle from '../../styles/pages/merchant-app/Login.module.css'
import { LoginContext } from "../../context/Login-context.jsx";
import {AlertContext} from '../../context/Alert-context.jsx'
import { reqLogin } from "../../api-merchant-app.jsx";

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate();
	const { setToken } = useContext(LoginContext);
	const {setAlert} = useContext(AlertContext)
	const location = useLocation()
	const from = location.state?.from?.pathname || ''

	const handleLogin = () => {
		setLoading(true)
		reqLogin(username, password).then((result) => {
			localStorage.setItem("token", result.token);
			setToken(result.token);
			if(from === '/merchant/login' || !from){
				window.location.href = '/merchant/dashboard'
			}else{
				window.location.replace(from)
			}
		}).catch((error) => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
			}else{
				const err = error?.response?.data?.errors
				setAlert({isOpen: true, status: 'warning', message: err})
			}
		}).finally(() => {
			setLoading(false)
		})
	};

	return (
		<>
		<Helmet>
		<title>Login | Antarin Merchant</title>
		</Helmet>
		<div className={loginStyle.box}>
		<div className={loginStyle.top}>
		<h1>Login</h1>
		<div className={loginStyle.logo}>
		<img src="/img/Logo Merchant.png" alt="" />
		</div>
		</div>
		<div className={loginStyle.middle}>
		<div className={loginStyle.form}>
		<span>Username<i className='required'> *</i></span>
		<input type="text" placeholder="Masukkan Username" autoCapitalize="none" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
		</div>
		<div className={loginStyle.form}>
		<span>Password<i className='required'> *</i></span>
		<input type="password" placeholder="Masukkan Password" autoCapitalize="none" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
		</div>
		<button onClick={handleLogin} disabled={loading}>{loading ? `Autentikasi . . .` : 'LOGIN'}</button>
		</div>
		<div className={loginStyle.bottom}>
		Belum punya akun?&nbsp;<Link to='/merchant/register'>Daftar Sekarang</Link>
		</div>
		</div>
		</>
		);
};

export default LoginPage;
