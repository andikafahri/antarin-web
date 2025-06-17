import {useState, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import m from '../../styles/components/merchant-app/SideMenu.module.css'

const SideMenuComponent = ({isOpen, onClose}) => {
	const navigate = useNavigate()
	const location = useLocation()

	const handleProfile = () => {
		navigate('/merchant/profile')
	}

	return (
		<>
		<div className={clsx(m.box, isOpen && m.open)}>
		<div role='button' className={m.boxProfile} onClick={handleProfile}>
		<img src="/img/mi-chili-oil.jpg" alt="" />
		<div className={m.info}>
		<h1>Andika Chili Oil</h1>
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
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'timeoperational' ? m.active : '')} onClick={onClose}>Kelola Jam Operasional</Link>
			{/*</div>*/}
			{/*<div className={m.row}>*/}
		<Link className={clsx(m.row, location.pathname.split('/')[2] === 'history' ? m.active : '')} onClick={onClose}>Riwayat</Link>
			{/*</div>*/}
		</div>
		<div className={m.bottom}>
		<button className={m.btnLogout}>LOGOUT</button>
		</div>
		</div>
		</>
		)
}

export default SideMenuComponent