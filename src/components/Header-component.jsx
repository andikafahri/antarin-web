import {useState, useContext, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {LoginContext} from '../context/Login-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import headerStyle from '../styles/components/Header.module.css'
import {getProfile} from '../api.jsx'
import DestinationPopupComponent from '../components/Destination-popup-component.jsx'

const HeaderComponent = () => {
	// LOGIN
	const navigate = useNavigate()
	const location = useLocation()
	const btnLogin = () => {
		console.log('LOCATION: ')
		console.log(location)
		// if(location.pathname !== '/'){
		// 	navigate('/login', {state: {from: location}, replace: true})
		// }else{
		navigate('/login', {state: {from: location}})
		// }
	}



	// IS LOGIN AND GET USER
	const {token, setToken} = useContext(LoginContext)
	const [isLogin, setIsLogin] = useState(false)
	const [profile, setProfile] = useState('')
	useEffect(() => {
		if(token){
			setIsLogin(true)
			getProfile().then(result => {
				setProfile(result.name)
			}).catch(error => {
				console.log(error)
				if(error.status === 401){
					setIsLogin(false)
				}
			})
		}else{
			setIsLogin(false)
			// navigate('/')
			// navigate('/login', {state: {from: location}, replace: true})
		}
	}, [token])



	// LOGOUT
	const logout = () => {
		localStorage.removeItem('token')
		// setToken('')
		// setIsOpenPopUpProfile(false)
		setTimeout(() => window.location.href = '/', 0)
	}



	// DESTINATION
	const [isOpenPopUpDestination, setIsOpenPopUpDestination] = useState(false)
	const togglePopUpDestination = () => {
		setIsOpenPopUpDestination((x) => !x)
	}
	
	if(isOpenPopUpDestination === true){
		document.body.classList.add('no-scroll')
	}else{
		document.body.classList.remove('no-scroll')
	}

	const {destinationSelected} = useContext(DestinationContext)



	// PROFILE
	const [isOpenPopUpProfile, setIsOpenPopUpProfile] = useState(false)
	const togglePopUpProfile = () => {
		setIsOpenPopUpProfile((x) => !x)
	}

	return (
		<>
		<div className={headerStyle.header}>
		<div className={headerStyle.logo}>
		<a href='/'>
		<img src='/img/Logo.png' />
		</a>
		</div>
		<div className={headerStyle.address}>
		<div role='button' className={clsx(headerStyle.addressContainer, 'notHighlight')} onClick={togglePopUpDestination}>
		<div className={headerStyle.left}>
		<label className={headerStyle.label}>Alamat</label>
		<label className={headerStyle.addressName}>{destinationSelected?.name || destinationSelected?.address || 'Tentukan alamat tujuan'}</label>
		</div>
		<div className={clsx(headerStyle.right, isOpenPopUpDestination && headerStyle.up)}>
		<i className="fas fa-chevron-down"></i>
		</div>
		</div>
		</div>
		{isLogin ? (
			<>
			<div role='button' className={clsx(headerStyle.profile, 'notHighlight')} onClick={togglePopUpProfile}>
			<div className={headerStyle.pictProfile}>
			<img src='/img/profile.jpg' />
			</div>
			</div>
		{/*<div className={`${headerStyle.dropdownProfile} ${headerStyle.hide}`}>*/}
			{/*<div className={`${headerStyle.dropdownProfile} ${'hide'}`}>*/}
			<div className={clsx(headerStyle.dropdownProfile, isOpenPopUpProfile && headerStyle.open)}>
			<span className={headerStyle.name}>{profile}</span>
			<div className={headerStyle.action}>
			<Link to='/profile' className='notHighlight'>Edit Profil</Link>
			<Link className='notHighlight'>Order</Link>
			<Link className='notHighlight'>Riwayat</Link>
			<Link className={clsx(headerStyle.btnLogout, 'notHighlight')} onClick={logout}>Logout</Link>
			</div>
			</div>
			</>

			) : (
			<button className={clsx(headerStyle.btnLogin, 'btn-second notHighlight')} onClick={btnLogin}>LOGIN</button>
			)}
			</div>

			<DestinationPopupComponent isOpen={isOpenPopUpDestination} onClose={togglePopUpDestination} />
			</>
			)
}

export default HeaderComponent