import {useState, useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {getProfile} from '../../api-merchant-app.jsx'
import h from '../../styles/components/merchant-app/Header.module.css'
import TimeOperationalComponent from './TimeOperational-component.jsx'
import SideMenuComponent from './SideMenu-component.jsx'

const HeaderComponent = () => {
	useEffect(() => {
		getMerchant()
		showTimeNow()
		const interval = setInterval(showTimeNow, 60000)
		return () => clearInterval(interval)
	}, [])

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

	const [status, setStatus] = useState(null)
	// HANDLE TIME OPERATIONAL DETAIL
	const [isOpenTimeOperational, setIsOpenTimeOperational] = useState(false)
	const toggleTimeOperational = () => {
		setIsOpenTimeOperational(x => !x)
	}

	// GET INFO MERCHANT
	const [info, setInfo] = useState({})
	const [loadingInfo, setLoadingInfo] = useState(true)
	const getMerchant = () => {
		setLoadingInfo(true)
		getProfile().then(result => {
			setInfo(result)
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}else{
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
			}
			return
		}).finally(() => {
			setLoadingInfo(false)
		})
	}

	// HANDLE SIDE MENU
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
		<div role='button' className={h.operational} onClick={toggleTimeOperational}>
		<div role='button' className={clsx(h.operationalContainer, 'notHighlight')}>
		<div className={h.left}>
		<label className={h.time}>{time.day} | {time.hour}:{time.minute}</label>
		{status ? (
			<label className={clsx(h.statusOperational, h.open)}>BUKA</label>
			) : (
			<label className={clsx(h.statusOperational, h.close)}>TUTUP</label>
			)}
			</div>
			<div className={clsx(h.right, isOpenTimeOperational && h.up)}>
			<i className='fas fa-chevron-down'></i>
			</div>
			</div>
			</div>
			<div role='button' className={clsx(h.menuBar, 'notHighlight')} onClick={toggleMenu}>
			<i className='fas fa-bars'></i>
			</div>
			</div>

		{/*TIME OPERATIONAL*/}
			<TimeOperationalComponent isOpen={isOpenTimeOperational} onClose={toggleTimeOperational} status={x => setStatus(x)} />

		{/*MENU*/}
			<SideMenuComponent isOpen={isOpenMenu} onClose={toggleMenu} data={info} />
			</>
			)
}

export default HeaderComponent