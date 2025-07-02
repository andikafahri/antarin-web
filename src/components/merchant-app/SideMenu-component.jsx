import {useState, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {jwtDecode} from 'jwt-decode'
import s from '../../styles/components/merchant-app/SideMenu.module.css'

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
		<div role='button' className={clsx(s.container, isOpen && s.open)} onClick={e => e.target === e.currentTarget && onClose()}>
		<div className={s.box}>
		<div role='button' className={s.boxProfile} onClick={handleProfile}>
		<img src={data.image || '/public/img/no-image.jpg'} alt="" />
		<div className={s.info}>
		<h1>{data.name}</h1>
		</div>
		</div>
		<div className={s.menu}>
		<Link className={clsx(s.row, location.pathname.split('/')[2] === 'dashboard' ? s.active : '')} to='/merchant/dashboard' onClick={onClose}>Dashboard</Link>
		<Link className={clsx(s.row, location.pathname.split('/')[2] === 'menu' ? s.active : '')} to='/merchant/menu' onClick={onClose}>Kelola Menu</Link>
		<Link className={clsx(s.row, location.pathname.split('/')[2] === 'time-operational' ? s.active : '')} to='/merchant/time-operational' onClick={onClose}>Kelola Jam Operasional</Link>
		<Link className={clsx(s.row, location.pathname.split('/')[2] === 'history' ? s.active : '')} onClick={onClose}>Riwayat</Link>
		</div>
		<div className={s.bottom}>
		<button className={s.btnLogout} onClick={handleLogout}>LOGOUT</button>
		</div>
		</div>
		</div>
		</>
		)
}

export default SideMenuComponent