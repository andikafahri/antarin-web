import {useState, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {jwtDecode} from 'jwt-decode'
import m from '../../styles/components/merchant-app/SideMenu.module.css'

const SideMenuComponent = ({isOpen, onClose, data}) => {
	const navigate = useNavigate()
	const location = useLocation()
	const idMerchant = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).id || null : null

	const handleProfile = () => {
		navigate('/merchant/profile')
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/merchant/login')
	}

	return (
		<>
		<div className={clsx(m.box, isOpen && m.open)}>
		<div role='button' className={m.boxProfile} onClick={handleProfile}>
		{/*<img src={data.image ? `${import.meta.env.VITE_BASEURL}/img/merchant/${idMerchant}/${data.image}` : '/public/img/no-image.jpg'} alt="" />*/}
		<img src={data.image || '/public/img/no-image.jpg'} alt="" />
		<div className={m.info}>
		<h1>{data.name}</h1>
		</div>
		</div>
		<div className={m.menu}>
			{/*<div className={clsx(m.row, m.active)}>*/}
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'dashboard' ? m.active : '')} to='/merchant/dashboard' onClick={onClose}>Dashboard</Link>
			{/*</div>*/}
			{/*<div className={m.row}>*/}
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'menu' ? m.active : '')} to='/merchant/menu' onClick={onClose}>Kelola Menu</Link>
			{/*</div>*/}
			{/*<div className={m.row}>*/}
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'time-operational' ? m.active : '')} to='/merchant/time-operational' onClick={onClose}>Kelola Jam Operasional</Link>
			{/*</div>*/}
			{/*<div className={m.row}>*/}
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'history' ? m.active : '')} onClick={onClose}>Riwayat</Link>
			{/*</div>*/}
		</div>
		<div className={m.bottom}>
		<button className={m.btnLogout} onClick={handleLogout}>LOGOUT</button>
		</div>
		</div>
		</>
		)
}

export default SideMenuComponent