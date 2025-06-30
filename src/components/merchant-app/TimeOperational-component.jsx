import {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {AlertContext} from '../../context/Alert-context.jsx'
import {TimeOperationalContext} from '../../context/merchant-app/Time-operational-context.jsx'
import {getTimeOperational, reqChangeMode} from '../../api-merchant-app.jsx'
import s from '../../styles/components/merchant-app/TimeOperational.module.css'

const TimeOperationalComponent = ({isOpen, onClose}) => {
	const {setAlert} = useContext(AlertContext)
	const dataDay = [
		{'id': 1, 'name': 'Senin'},
		{'id': 2, 'name': 'Selasa'},
		{'id': 3, 'name': 'Rabu'},
		{'id': 4, 'name': 'Kamis'},
		{'id': 5, 'name': "Jum'at"},
		{'id': 6, 'name': 'Sabtu'},
		{'id': 0, 'name': 'Minggu'}
	]
	// const [loading, setLoading] = useState(true)
	// const [list, setList] = useState(null)

	const {loading, getTime, timeOperational} = useContext(TimeOperationalContext)
	useEffect(() => {
		getTime()
	}, [])

	// useEffect(() => {
	// 	status(timeOperational?.is_open)
	// }, [timeOperational.is_open])

	// const getTime = () => {
	// 	setLoading(true)
	// 	getTimeOperational().then(result => {
	// 		setList(result)
	// 	}).catch(error => {
	// 		setList(null)
	// 	}).finally(() => {
	// 		setLoading(false)
	// 	})
	// }


	
	const ListComponent = () => {
		if(loading){
			return 'Memuat . . .'
		}

		return (
			<>
			<h1>Jam Operasional</h1>
			<div className={s.list}>
			{timeOperational.is_open_mode !== 'auto' ? (
				<div className={s.disabled}></div>
				) : ('')}
			{/*{!list || list.length === 0 ? (
				<p style={{textAlign: 'center'}}>Kosong</p>
				) : (
				list.map(list => (
					<div className={s.row} key={list.id}>
					<span>{dataDay.find(day => day.id === list.day).name}</span>
					<span className={s.time}>{list.start_time} - {list.end_time}</span>
					<span className={s.status}><label className={s.open}>BUKA</label></span>
					</div>
					))
				)

			}*/}

			{/*{[...Array(7)].map((_,i) => {
				const isBuka = list.find(x => x.day === i)
				
				return (
					isBuka ? (
						<div className={s.row} key={list[i]?.id}>
						<span>{dataDay[i].name}</span>
						<span className={s.time}>{list[i]?.start_time} - {list[i]?.end_time}</span>
						<span className={s.status}><label className={s.open}>BUKA</label></span>
						</div>
						) : (
						<div className={s.row} key={list[i]?.id}>
						<span>{dataDay[i].name}</span>
						<span className={s.time}>{list[i]?.start_time} - {list[i]?.end_time}</span>
						<span className={s.status}><label className={s.close}>LIBUR</label></span>
						</div>
						)
						)
			})}*/}


			{dataDay.map(item => {
				const day = timeOperational?.schedule?.find(x => x.day === item.id)
				
				return (
					day ? (
						<div className={s.row} key={day?.id}>
						<span className={s.day}>{item.name}</span>
						<span className={s.time}>{day?.start_time} - {day?.end_time}</span>
						<span className={s.status}><label className={s.open}>BUKA</label></span>
						</div>
						) : (
						<div className={s.row} key={day?.id}>
						<span className={s.day}>{item.name}</span>
						<span className={s.time}>-</span>
						<span className={s.status}><label className={s.close}>LIBUR</label></span>
						</div>
						)
						)
			})}

			</div>
			</>
			)
	}

	// const [changeLoading, setChangeLoading] = useState(false)
	const handleMode = (mode) => {
		// setChangeLoading(true)
		reqChangeMode(mode).then(result => {
			// setAlert({isOpen: true, status: 'success', message: result})
			getTime()
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
			// setChangeLoading(false)
		})
	}

	return (
		<>
		<div role='button' className={clsx(s.container, isOpen && s.open)} onClick={e => e.target === e.currentTarget && onClose()}>
		<div className={s.box}>
		<div className={s.header}>
		<h2>Mode</h2>
		<div className={s.wrapper}>
		{/*<div className={s.loading}>Proses . . .</div>*/}
		<span role='button' className={clsx(timeOperational.is_open_mode === 'close' ? s.active : '', 'notHighlight')} onClick={() => handleMode('close')}>LIBUR</span>
		<span role='button' className={clsx(timeOperational.is_open_mode === 'auto' ? s.active : '', 'notHighlight')} onClick={() => handleMode('auto')}>OTOMATIS</span>
		<span role='button' className={clsx(timeOperational.is_open_mode === 'open' ? s.active : '', 'notHighlight')} onClick={() => handleMode('open')}>BUKA</span>
		</div>
		</div>
		{timeOperational.is_open_mode === 'auto' ? (
			<p>Dengan mode <b>otomatis</b>, Jam Operasional kedai Kamu akan <b>mengikuti jadwal</b> yang sudah Kamu tentukan.</p>
			) : timeOperational.is_open_mode === 'open' ? (
			<p>Dengan mode <b>buka</b>, kedai Kamu akan terus <b style={{color: '#34c134'}}>buka</b> sampai Kamu mengubah mode lagi.</p>
			) : (
			<p>Dengan mode <b>libur</b>, kedai Kamu akan terus <b style={{color: 'var(--danger-color)'}}>tutup</b> sampai Kamu mengubah mode lagi.</p>
			)}
		{/*<h1>Jam Operasional</h1>
		<div className={s.list}>
		<div className={s.row}>
		<span>Senin</span>
		<span className={s.time}>08:00 - 21:00</span>
		<span className={s.status}><label className={s.open}>BUKA</label></span>
		</div>
		<div className={s.row}>
		<span>Selasa</span>
		<span className={s.time}>08:00 - 21:00</span>
		<span className={s.status}><label className={s.open}>BUKA</label></span>
		</div>
		</div>*/}
			<ListComponent />
			<Link to='/merchant/time-operational' className={clsx(s.action, 'notHighlight')} onClick={onClose}>Kelola Jam Operasional</Link>
			</div>
			</div>
			</>
			)
}

export default TimeOperationalComponent