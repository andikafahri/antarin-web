import {useState, useEffect} from 'react'
import clsx from 'clsx'
import {getTimeOperational} from '../api.jsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const TimeOperationalModal = ({idMerchant, isOpen, onClose}) => {
	const dataDay = [
		{'id': 1, 'name': 'Senin'},
		{'id': 2, 'name': 'Selasa'},
		{'id': 3, 'name': 'Rabu'},
		{'id': 4, 'name': 'Kamis'},
		{'id': 5, 'name': "Jum'at"},
		{'id': 6, 'name': 'Sabtu'},
		{'id': 7, 'name': 'Minggu'}
	]

	useEffect(() => {
		getTime()
	}, [idMerchant])

	const [loadingTimeOperational, setLoadingTimeOperational] = useState(true)
	const [listTimeOperational, setListTimeOperational] = useState(null)
	const getTime = () => {
		setLoadingTimeOperational(true)
		getTimeOperational(idMerchant).then(result => {
			setListTimeOperational(result)
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
			setLoadingTimeOperational(false)
		})
	}

	const TimeOperationalList = () => {
		return dataDay.map(time => {
			const day = listTimeOperational?.find(x => x.day === time.id)
			return (
				day ? (
					<span className={new Date().getDay() === time.id ? merchantStyle.active : ''}>
					<h3>{time.name}</h3>
					<h3>{day.start_time} - {day.end_time}</h3>
					</span>
					) : (
					<span className={new Date().getDay() === time.id ? merchantStyle.active : ''}>
					<h3>{time.name}</h3>
					<h3 style={{
						color: 'var(--danger-color)',
						fontWeight: 'bold',
						letterSpacing: '1px',
						fontSize: '.9rem',
						textAlign: 'center',
						alignContent: 'center',
						width: '100%'
					}}>LIBUR</h3>
					</span>
					)
					)
		})
	}

	return (
		<>
		<div role='button' className={clsx(merchantStyle.modal, isOpen && merchantStyle.open)} onClick={(e) => {
			if(e.target === e.currentTarget){onClose()}
		}}>
	<div className={merchantStyle.modalOperationalTime}>
	<button className={merchantStyle.btnClose} onClick={() => onClose()}><i className="fas fa-close"></i></button>
	<h2>Jam Buka</h2>
	<div className={merchantStyle.containerListTime}>
	<div className={merchantStyle.listTime}>
	<TimeOperationalList idMerchant={idMerchant} />
	</div>
	</div>
	</div>
	</div>
	</>
	)
}

export default TimeOperationalModal