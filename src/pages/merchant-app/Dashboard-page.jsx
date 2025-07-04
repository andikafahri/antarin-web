import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {Helmet} from 'react-helmet'
import {AlertContext} from '../../context/Alert-context.jsx'
import {SocketContext} from '../../context/Socket-context.jsx'
import {getOrder} from '../../api-merchant-app.jsx'
import style from '../../styles/pages/merchant-app/Dashboard.module.css'
import DetailOrderWaitingConfirmModal from '../../modal/merchant-app/Detail-order-waiting-confirm-modal.jsx'
import DetailOrderOnProcessModal from '../../modal/merchant-app/Detail-order-on-process-modal.jsx'
import DetailOrderFinish from '../../modal/merchant-app/Detail-order-finish-modal.jsx'

const DashboardPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {setAlert} = useContext(AlertContext)

	useEffect(() => {
		getDataOrderWaitingConfirm()
		getDataOrderOnProcess()
		getDataOrderWaitingCourier()
		getDataOrderOnDeliver()
	}, [])

	const token = localStorage.getItem('token')
	const {useSocket, setRoleSocket} = useContext(SocketContext)
	const [newWaitingConfirm, setNewWaitingConfirm] = useState()
	const [newPickUp, setNewPickUp] = useState()
	useEffect(() => {
		setRoleSocket('merchant')
		if(token){

			if(useSocket?.connected){
				useSocket?.emit('subscribeOrderMerchant')
				console.log('SUBSCRIBED')
			}else{
				useSocket?.once('connect', () => {
					useSocket?.emit('subscribeOrderMerchant')
				})
			}

			useSocket?.on('updateNewOrder', (result) => {
				console.log('RESULT: ')
				console.log(result)
				setDataOrderWaitingConfirm(prev => [...prev, result])
				setNewWaitingConfirm(result.id_order)
				console.log('UPDATE NEW ORDER WITH SOCKET')
				setTimeout(() => {
					setNewWaitingConfirm(null)
					console.log(newWaitingConfirm)
				}, 1000)
			})

			useSocket?.on('updatePickUp', (result) => {
				console.log('RESULT: ')
				console.log(result)
				getDataOrderWaitingCourier()
				setDataOrderOnDeliver(prev => [...prev, result])
				setNewPickUp(result.id_order)
				console.log('UPDATE NEW ORDER WITH SOCKET')
				setTimeout(() => {
					setNewPickUp(null)
					console.log(newPickUp)
				}, 1000)
			})
		}

		return () => {
			useSocket?.off('updateNewOrder')
			useSocket?.off('updatePickUp')
			useSocket?.off('connect')
		}
	}, [useSocket])



	// GET DATA ORDER WAITING CONFIRM
	const [dataOrderWaitingConfirm, setDataOrderWaitingConfirm] = useState()
	const getDataOrderWaitingConfirm = () => {
		getOrder(1).then((result) => {
			setDataOrderWaitingConfirm(result)
		}).catch((error) => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		})
	}



	// WAITING CONFIRM LIST COMPONENT
	const WaitingConfirmList = () => {
		if(!dataOrderWaitingConfirm || dataOrderWaitingConfirm.length === 0){
			return <div className={style.empty}>Kosong</div>
		}

		return dataOrderWaitingConfirm.map((item, i) => {
			return (
				<div className={style.border}>
				<div role='button' className={clsx(style.row, item.id_order === newWaitingConfirm ? style.new : '')} onClick={() => {openModalDetailWaitingConfirm(item)}} key={i}>
				<div className={style.picture}>
				<img src="/img/profile.jpg" alt="" />
				</div>
				<div className={style.info}>
				<div className={style.left}>
				<h2>{item.user}</h2>
				<h3>{item.destination}</h3>
				</div>
				<div className={style.right}>
				<h2>{
					item.items.reduce((sum, item) => {
						return sum + item.qty
					}, 0)
				} item</h2>
				</div>
				</div>
				</div>
				</div>
				)
		})
	}



	// HANDLE MODAL DETAIL WAITING CONFIRM
	const [isOpenModalDetailWaitingConfirm, setIsOpenModalDetailWaitingConfirm] = useState(false)
	const [detailOrderWaitingConfirm, setDetailOrderWaitingConfirm] = useState()
	const openModalDetailWaitingConfirm = (item) => {
		setIsOpenModalDetailWaitingConfirm(true)
		setDetailOrderWaitingConfirm(item)
	}

	const closeModalDetailWaitingConfirm = () => {
		setIsOpenModalDetailWaitingConfirm(false)
		getDataOrderWaitingConfirm()
		getDataOrderOnProcess()
		getDataOrderWaitingCourier()
	}



	// GET DATA ORDER ON PROCESS
	const [dataOrderOnProcess, setDataOrderOnProcess] = useState()
	const getDataOrderOnProcess = () => {
		getOrder(2).then((result) => {
			setDataOrderOnProcess(result)
			console.log(result)
		}).catch((error) => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		})
	}



	// ON PROCESS LIST COMPONENT
	const OnProcessList = () => {
		if(!dataOrderOnProcess || dataOrderOnProcess.length === 0){
			return <div className={style.empty}>Kosong</div>
		}

		return dataOrderOnProcess.map((item, i) => {
			return (
				<div role='button' className={style.row} onClick={() => {openModalDetailOnProcess(item)}} key={i}>
				<div className={style.picture}>
				<img src="/img/profile.jpg" alt="" />
				</div>
				<div className={style.info}>
				<div className={style.left}>
				<h2>{item.user}</h2>
				<h3>{item.destination}</h3>
				</div>
				<div className={style.right}>
				<h2>{
					item.items.reduce((sum, item) => {
						return sum + item.qty
					}, 0)
				} item</h2>
				</div>
				</div>
				</div>
				)
		})
	}



	// HANDLE MODAL DETAIL ON PROCESS
	const [isOpenModalDetailOnProcess, setIsOpenModalDetailOnProcess] = useState(false)
	const [detailOrderOnProcess, setDetailOrderOnProcess] = useState()
	const openModalDetailOnProcess = (item) => {
		setIsOpenModalDetailOnProcess(true)
		setDetailOrderOnProcess(item)
	}

	const closeModalDetailOnProcess = () => {
		setIsOpenModalDetailOnProcess(false)
		getDataOrderWaitingConfirm()
		getDataOrderOnProcess()
		getDataOrderWaitingCourier()
	}



	// GET DATA ORDER WAITING COURIER
	const [dataOrderWaitingCourier, setDataOrderWaitingCourier] = useState()
	const getDataOrderWaitingCourier = () => {
		getOrder(5).then((result) => {
			setDataOrderWaitingCourier(result)
		}).catch((error) => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		})
	}



	// GET DATA ORDER DELIVER
	const [dataOrderOnDeliver, setDataOrderOnDeliver] = useState()
	const getDataOrderOnDeliver = () => {
		getOrder(6).then((result) => {
			setDataOrderOnDeliver(result)
		}).catch((error) => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		})
	}



	// FINISH LIST COMPONENT
	const FinishList = () => {
		if((!dataOrderWaitingCourier || dataOrderWaitingCourier.length === 0) && (!dataOrderOnDeliver || dataOrderOnDeliver.length ===0)){
			return <div className={style.empty}>Kosong</div>
		}

		return (
			<>
			{dataOrderWaitingCourier?.map((item, i) => (
				<div role='button' className={style.row} onClick={() => {openModalDetailFinish(item, 'waitingCourier')}} key={i}>
				<div className={style.picture}>
				<img src="/img/profile.jpg" alt="" />
				</div>
				<div className={style.info}>
				<div className={style.left}>
				<h2>{item.user}</h2>
				<h3>Kurir: {item.courier.name}</h3>
				<div className={style.status}>
				<i className='fas fa-clock'></i>
				<h4>Menunggu diambil kurir</h4>
				</div>
				</div>
				<div className={style.right}>
				<h2>{
					item.items.reduce((sum, item) => {
						return sum + item.qty
					}, 0)
				} item</h2>
				</div>
				</div>
				</div>
				))}
			{dataOrderOnDeliver?.map((item, i) => (
				<div role='button' className={clsx(style.border, newPickUp === item.id_order ? style.new : '')} onClick={() => {openModalDetailFinish(item, 'pickUp')}} key={i}>
				<div className={style.row} key={i}>
				<div className={style.picture}>
				<img src="/img/profile.jpg" alt="" />
				</div>
				<div className={style.info}>
				<div className={style.left}>
				<h2>{item.user}</h2>
				<h3>Kurir: {item.courier.name}</h3>
				<div className={style.status}>
				<i className='fas fa-clipboard-check'></i>
				<h4>Diambil kurir</h4>
				</div>
				</div>
				<div className={style.right}>
				<h2>{
					item.items.reduce((sum, item) => {
						return sum + item.qty
					}, 0)
				} item</h2>
				</div>
				</div>
				</div>
				</div>
				))}
			</>
			)
	}



	// HANDLE MODAL DETAIL FINISH
	const [isOpenModalDetailFinish, setIsOpenModalDetailFinish] = useState(false)
	const [detailOrderFinish, setDetailOrderFinish] = useState()
	const [statusFinish, setStatusFinish] = useState(null)
	const openModalDetailFinish = (item, status) => {
		setIsOpenModalDetailFinish(true)
		setDetailOrderFinish(item)
		setStatusFinish(status)
	}

	const closeModalDetailFinish = () => {
		setIsOpenModalDetailFinish(false)
		getDataOrderWaitingConfirm()
		getDataOrderOnProcess()
		getDataOrderWaitingCourier()
		getDataOrderOnDeliver()
	}



	// SET BODY NO SCROLL
	useEffect(() => {
		if(isOpenModalDetailWaitingConfirm || isOpenModalDetailOnProcess || isOpenModalDetailFinish){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}	
	}, [isOpenModalDetailWaitingConfirm, isOpenModalDetailOnProcess, isOpenModalDetailFinish])

	return (
		<>
		<Helmet>
		<title>Dashboard | Merchant</title>
		</Helmet>
		<div className={style.container}>
		<div className={style.widgetGroup}>
		<div className={clsx(style.widget, style.toBeConfirm)}>
		<div className={style.box}>
		<label>Menunggu Konfirmasi</label>
		<span>{dataOrderWaitingConfirm?.length ?? '-'}</span>
		</div>
		</div>
		<div className={clsx(style.widget, style.onProcess)}>
		<div className={style.box}>
		<label>Dalam Proses</label>
		<span>{dataOrderOnProcess?.length ?? '-'}</span>
		</div>
		</div>
		<div className={clsx(style.widget, style.waitingCourier)}>
		<div className={style.box}>
		<label>Pesanan Selesai</label>
		<span>{(dataOrderWaitingCourier?.length ?? '-') + (dataOrderOnDeliver?.length ?? '-')}</span>
		</div>
		</div>
		</div>

		<div className={style.containerContent}>
		<div className={style.content}>
		<div className={style.box}>
		<h1 className={style.title}>Menunggu Konfirmasi</h1>
		<div className={clsx(style.table, style.waitingConfirm)}>
		<WaitingConfirmList />
		</div>
		</div>
		</div>

		<div className={style.content}>
		<div className={style.box}>
		<h1 className={style.title}>Dalam Proses</h1>
		<div className={style.table}>
		<OnProcessList />
		</div>
		</div>
		</div>

		<div className={style.content}>
		<div className={style.box}>
		<h1 className={style.title}>Pesanan Selesai</h1>
		<div className={clsx(style.table, style.finish)}>
		<FinishList />
		</div>
		</div>
		</div>

		</div>
		</div>

		<DetailOrderWaitingConfirmModal isOpen={isOpenModalDetailWaitingConfirm} onClose={closeModalDetailWaitingConfirm} data={detailOrderWaitingConfirm} />

		<DetailOrderOnProcessModal isOpen={isOpenModalDetailOnProcess} onClose={closeModalDetailOnProcess} data={detailOrderOnProcess} />

		<DetailOrderFinish isOpen={isOpenModalDetailFinish} onClose={closeModalDetailFinish} data={detailOrderFinish} status={statusFinish} />
		</>
		)
}

export default DashboardPage