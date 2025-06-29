import {useState, useContext} from 'react'
import {useNavigate, useLocation, Link} from "react-router-dom";
import registerStyle from '../styles/pages/Register.module.css'
import {AlertContext} from '../context/Alert-context.jsx'
import {reqRegister} from '../api.jsx'

const RegisterPage = () => {
	const navigate = useNavigate()

	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(false)

	const data = {name, username, password, confirm_password: confirmPassword, email, phone}
	const {setAlert} = useContext(AlertContext)
	const handleRegister = () => {
		setLoading(true)
		reqRegister(data).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Register berhasil'})
			navigate('/login')
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
			}else{
				const err = error.response.data.errors
				setAlert({isOpen: true, status: 'warning', message: err})
			}
		}).finally(() => {
			setLoading(false)
		})
	}

	return (
	<>
	<div className={registerStyle.box}>
		<div className={registerStyle.top}>
			<h1>Register</h1>
			<div className={registerStyle.logo}>
				<img src="/img/Logo Antarin.png" alt="" />
			</div>
		</div>
		<div className={registerStyle.middle}>
			<div className={registerStyle.form}>
				<span>Nama<i className='required'> *</i></span>
				<input type="text" placeholder="Masukkan Nama" autoCapitalize="" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<div className={registerStyle.form}>
				<span>Username<i className='required'> *</i></span>
				<input type="text" placeholder="Masukkan Username" autoCapitalize="none" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<div className={registerStyle.form}>
				<span>Password<i className='required'> *</i></span>
				<input type="text" placeholder="Masukkan Password" autoCapitalize="none" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<div className={registerStyle.form}>
				<span>Ulangi Password<i className='required'> *</i></span>
				<input type="text" placeholder="Ulangi Password" autoCapitalize="none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<div className={registerStyle.form}>
				<span>Email<i className='required'> *</i></span>
				<input type="email" placeholder="Masukkan Email" autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<div className={registerStyle.form}>
				<span>No. WhatsApp</span>
				<input type="number" placeholder="Masukkan No. WhatsApp" autoCapitalize="none" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
			</div>
			<button onClick={handleRegister} disabled={loading}>{loading ? `Proses . . .` : 'REGISTER'}</button>
		</div>
		{/*<div className={registerStyle.bottom}>
			Belum punya akun?&nbsp;<Link>Daftar Sekarang</Link>
		</div>*/}
	</div>
	</>
	)
}

export default RegisterPage