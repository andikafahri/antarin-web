import {useState, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import h from '../../styles/components/merchant-app/Header.module.css'
import SideMenuComponent from './SideMenu-component.jsx'

const HeaderComponent = () => {
	// SHOW TIME NOW
	const [time, setTime] = useState({day: '', hour: '', minute: ''})
	
	const showTimeNow = () => {
		const now = new Date()

		const formatter = new Intl.DateTimeFormat('id-ID', {
			timeZone: 'Asia/Jakarta',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit'
		})

		const parts = formatter.formatToParts(now)

		const day = parts.find(x => x.type === 'weekday')?.value || ''
		const hour = parts.find(x => x.type === 'hour')?.value || ''
		const minute = parts.find(x => x.type === 'minute')?.value || ''

		setTime({day, hour, minute})
	}

	useEffect(() => {
		showTimeNow()
		const interval = setInterval(showTimeNow, 5000)
		return () => clearInterval(interval)
	}, [])

	// HANDLE MENU
	const [isOpenMenu, setIsOpenMenu] = useState(false)
	const toggleMenu = () => {
		setIsOpenMenu((x) => !x)
	}

	return (
		<>
		<div className={h.header}>
		<div className={h.logo}>
		<a href='/'>
		<img src='/img/Logo Antarin.png' />
		</a>
		</div>
		<div className={h.operational}>
		<div role='button' className={clsx(h.operationalContainer, 'notHighlight')}>
		<div className={h.left}>
		<label className={h.time}>{time.day} | {time.hour}:{time.minute}</label>
		<label className={h.statusOperational}>BUKA</label>
		</div>
		<div className={clsx(h.right)}>
		<i className="fas fa-chevron-down"></i>
		</div>
		</div>
		</div>
		<div role='button' className={clsx(h.menuBar, 'notHighlight')} onClick={toggleMenu}>
		<i className='fas fa-bars'></i>
		</div>
		</div>

		{/*MENU*/}
		<SideMenuComponent isOpen={isOpenMenu} onClose={toggleMenu} />
		</>
		)
}

export default HeaderComponent