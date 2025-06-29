import {useState, useEffect, useContext, useRef} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {AlertContext} from '../../context/Alert-context.jsx'
import {TimeOperationalContext} from '../../context/merchant-app/Time-operational-context.jsx'
import {getTimeOperational, reqAddTimeOperational, reqUpdateTimeOperational, reqDeleteTimeOperational} from '../../api-merchant-app.jsx'
import SelectComponent from '../../components/Select-component.jsx'
import s from '../../styles/pages/merchant-app/TimeOperational.module.css'

const ListComponent = ({listLoading, list, updating, setUpdating, handleDayDropdown, isOpenDropdownDay, handleBoxTime, isOpenBoxTime, handleSaveTime, dataDay, startTimeValue, setStartTimeValue, endTimeValue, setEndTimeValue, handleCancel, handleUpdate, handleDelete, btnLoading, request, setRequest}) => {
	if(listLoading){
		return 'Memuat . . .'
	}

	if(list.length === 0){
		return'Kosong'
	}

	return (
		<>
		{list?.map(item => (
			item.id === updating ? (
				<div className={s.rowAdd} key={item.id}>
				<div className={s.left}>
				<SelectComponent styling={{height: '30px', fontWeight: 'normal', border: 'none'}} stylingValue={{fontSize: '.9rem'}} stylingOptionBox={{width: '130px', fontWeight: 'normal', fontSize: '.85rem'}} defaultValue={'Pilih Hari'} handle={handleDayDropdown} isOpen={isOpenDropdownDay} data={dataDay} selected={request?.day ?? ''} onSelect={day => setRequest({...request, day: day.id})} />
				</div>
				<div className={clsx(s.middle, 'notHighlight')}>
				<div className={s.value} onClick={handleBoxTime}>
				<span className={s.time}>{request?.start_time ? `${request?.start_time} - ${request?.end_time}` : 'Tentukan waktu'}</span>
				<i className={clsx('fas fa-chevron-down', isOpenBoxTime && s.open)}></i>
				</div>
				<div className={clsx(s.boxTimeInput, isOpenBoxTime ? s.open : '')}>
				<div className={s.row}>
				<label>Buka pukul :</label>
				<input type="text" value={startTimeValue ?? request?.start_time} onChange={(e) => setStartTimeValue(e.target.value)} />
				</div>
				<div className={s.row}>
				<label>Tutup pukul :</label>
				<input type="text" value={endTimeValue ?? request?.end_time} onChange={(e) => setEndTimeValue(e.target.value)} />
				</div>
				<div className={clsx(s.row, s.btnGroup)}>
				<button className={clsx(s.btnCloseTime, 'btn-danger')} onClick={handleBoxTime} disabled={btnLoading}>BATAL</button>
				<button className={clsx(s.btnSaveTime, 'btn-primary')} onClick={handleSaveTime} disabled={btnLoading}>SIMPAN</button>
				</div>
				</div>
				</div>
				<div className={s.action}>
				<button className={clsx(s.btnCancel, 'btn-danger')} onClick={handleCancel} disabled={btnLoading}>BATAL</button>
				<button className={clsx(s.btnSave, 'btn-primary')} onClick={() => handleUpdate(item.id)} disabled={btnLoading}>SIMPAN</button>
				</div>
				</div>
				) : (
				<div className={s.row} key={item.id}>
				<span>{dataDay.find(day => day.id === item.day).name}</span>
				<span className={s.time}>{item.start_time} - {item.end_time}</span>
				<span className={s.action}>
				<button className={s.btnUpdate} onClick={() => {handleCancel(); setUpdating(item.id); setRequest(item)}} disabled={btnLoading}><i className='fas fa-pencil'></i></button>
				<button className={s.btnDelete} onClick={() => handleDelete(item.id)} disabled={btnLoading}><i className='fas fa-close'></i></button>
				</span>
				</div>
				)
				))}
		</>
		)
}

const TimeOperationalPage = () => {
	const {setAlert} = useContext(AlertContext)
	const location = useLocation()
	const navigate = useNavigate()
	const dataDay = [
		{'id': 1, 'name': 'Senin'},
		{'id': 2, 'name': 'Selasa'},
		{'id': 3, 'name': 'Rabu'},
		{'id': 4, 'name': 'Kamis'},
		{'id': 5, 'name': "Jum'at"},
		{'id': 6, 'name': 'Sabtu'},
		{'id': 0, 'name': 'Minggu'}
	]
	// const [list, setList] = useState({})
	const [updating, setUpdating] = useState(null)
	const inputRef = useRef({})
	const [startTimeValue, setStartTimeValue] = useState(null)
	const [endTimeValue, setEndTimeValue] = useState(null)
	const [request, setRequest] = useState({})

	const [listLoading, setListLoading] = useState(true)
	const {getTime, loading, timeOperational} = useContext(TimeOperationalContext)
	useEffect(() => {
		getTime()
	}, [])

	useEffect(() => {
		setListLoading(loading)
	}, [loading])

	// const getList = () => {
	// 	setListLoading(true)
	// 	getTimeOperational().then(result => {
	// 		setList(result)
	// 	}).catch(error => {
	// 		if(error.status === 500){
	// 			setAlert({isOpen: true, status: 'danger', message: 'Server error'})
	// 		}else if(error.status === 401){
	// 			navigate('/merchant/login', {state: {from: location}, replace: true})
	// 		}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
	// 			setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
	// 		}else{
	// 			setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
	// 		}
	// 		return
	// 	}).finally(() => {
	// 		setListLoading(false)
	// 	})
	// }

	const [isOpenAddingRow, setIsOpenAddingRow] = useState(false)
	const [isOpenBoxTime, setIsOpenBoxTime] = useState(false)
	const handleBoxTime = () => {
		setIsOpenBoxTime(x => !x)
		inputRef.current.start_time.focus()
	}

	const [isOpenDropdownDay, setIsOpenDropdownDay] = useState(false)
	const handleDayDropdown = () => {
		setIsOpenDropdownDay(x => !x)
	}

	const handleSaveTime = () => {
		setRequest({...request, start_time: startTimeValue, end_time: endTimeValue})
		handleBoxTime()
	}

	const [btnLoading, setBtnLoading] = useState(false)
	const handleAdd = () => {
		setBtnLoading(true)
		reqAddTimeOperational(request).then(result => {
			setAlert({isOpen: true, status: 'success', message: result})
			// getList()
			getTime()
			setIsOpenAddingRow(false)
			setRequest({})
			// setStartTimeValue(null)
			// setEndTimeValue(null)
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
			setBtnLoading(false)
		})
	}

	const handleUpdate = (idTime) => {
		setBtnLoading(true)
		const {id, ...req} = request
		reqUpdateTimeOperational(idTime, req).then(result => {
			setAlert({isOpen: true, status: 'success', message: result})
			// getList()
			getTime()
			setUpdating(null)
			setRequest({})
			setStartTimeValue(null)
			setEndTimeValue(null)
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
			setBtnLoading(false)
		})
	}

	const handleDelete = (id) => {
		setBtnLoading(true)
		reqDeleteTimeOperational(id).then(result => {
			setAlert({isOpen: true, status: 'success', message: result})
			// getList()
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
			setBtnLoading(false)
		})
	}

	const handleCancel = () => {
		setIsOpenAddingRow(false)
		setUpdating(null)
		setBtnLoading(false)
		setRequest({})
		// setStartTimeValue(null)
		// setEndTimeValue(null)
	}

	return (
		<>
		<div className={s.container}>
		<div className={s.box}>
		<h1>Jam Operasional</h1>
		<div className={s.list}>
		<ListComponent listLoading={listLoading} list={timeOperational?.schedule || []} updating={updating} setUpdating={setUpdating} handleDayDropdown={handleDayDropdown} isOpenDropdownDay={isOpenDropdownDay} handleBoxTime={handleBoxTime} isOpenBoxTime={isOpenBoxTime} handleSaveTime={handleSaveTime} dataDay={dataDay} startTimeValue={startTimeValue} setStartTimeValue={setStartTimeValue} endTimeValue={endTimeValue} setEndTimeValue={setEndTimeValue} handleCancel={handleCancel} handleUpdate={handleUpdate} handleDelete={handleDelete} btnLoading={btnLoading} request={request} setRequest={setRequest} />

		{isOpenAddingRow ? (
			<div className={s.rowAdd}>
			<div className={s.left}>
			<SelectComponent styling={{height: '30px', fontWeight: 'normal', border: 'none'}} stylingValue={{fontSize: '.9rem'}} stylingOptionBox={{width: '130px', fontWeight: 'normal', fontSize: '.85rem'}} defaultValue={'Pilih Hari'} handle={handleDayDropdown} isOpen={isOpenDropdownDay} data={dataDay} selected={request?.day ?? ''} onSelect={day => setRequest({...request, day: day.id})} />
			</div>
			<div className={clsx(s.middle, 'notHighlight')}>
			<div className={s.value} onClick={handleBoxTime}>
			<span className={s.time}>{request?.start_time ? `${request?.start_time} - ${request?.end_time}` : 'Tentukan waktu'}</span>
			<i className={clsx('fas fa-chevron-down', isOpenBoxTime && s.open)}></i>
			</div>
			<div className={clsx(s.boxTimeInput, isOpenBoxTime ? s.open : '')}>
			<div className={s.row}>
			<label>Buka pukul :</label>
			<input type="text" ref={e => inputRef.current.start_time = e} value={startTimeValue ?? ''} placeholder='Cth: 08:00' onChange={(e) => setStartTimeValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveTime()} />
			</div>
			<div className={s.row}>
			<label>Tutup pukul :</label>
			<input type="text" ref={e => inputRef.current.end_time = e} value={endTimeValue ?? ''} placeholder='Cth: 21:00' onChange={(e) => setEndTimeValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveTime()} />
			</div>
			<div className={clsx(s.row, s.btnGroup)}>
			<button className={clsx(s.btnCloseTime, 'btn-danger')} onClick={handleBoxTime} disabled={btnLoading}>BATAL</button>
			<button className={clsx(s.btnSaveTime, 'btn-primary')} onClick={handleSaveTime} disabled={btnLoading}>SIMPAN</button>
			</div>
			</div>
			</div>
			<div className={s.action}>
			<button className={clsx(s.btnCancel, 'btn-danger')} onClick={handleCancel} disabled={btnLoading}>BATAL</button>
			<button className={clsx(s.btnSave, 'btn-primary')} onClick={handleAdd} disabled={btnLoading}>SIMPAN</button>
			</div>
			</div>
			) : ('')

	}

	<div className={s.row}>
	<button className={clsx(s.btnAdd, 'btn-primary')} onClick={() => {handleCancel(); setIsOpenAddingRow(true)}} disabled={isOpenAddingRow || btnLoading}>TAMBAH</button>
	</div>
	</div>
	</div>
	</div>
	</>
	)
}

export default TimeOperationalPage