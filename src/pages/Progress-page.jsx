import {useContext, useEffect, useState, useRef} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import clsx from 'clsx'
import socket from '../function/Socket-function.jsx'
import progressStyle from '../styles/pages/Progress.module.css'
import {OrderContext} from '../context/Order-context.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {SocketContext} from '../context/Socket-context.jsx'
import {reqCancel} from '../api.jsx'

const ProgressPage = () => {
	// GET DATA ORDER
	const {dataOrderContext, getDataOrder} = useContext(OrderContext)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		getDataOrder()
		console.log('GET ORDER PROGRESS PAGE')
		console.log(dataOrderContext)
	}, [])

	useEffect(() => {
		// setLoading(true)
		// if((dataOrderContext && dataOrderContext !== '') || dataOrderContext === null){
		if(dataOrderContext || dataOrderContext === null){
			setLoading(false)
		}
	}, [dataOrderContext])



		// SHOW STATUS ORDER
	const statusMessage = {
		1: 'Pesanan telah dibuat. Menunggu konfirmasi dari merchant',
		2: 'Pesanan diproses oleh merchant',
		3: 'Maaf, pesanan ditolak oleh merchant',
		5: 'Kurir mengambil pesanan'
	}
	const [status, setStatus] = useState('')
	useEffect(() => {
		setStatus(statusMessage[dataOrderContext?.status?.id] || dataOrderContext?.status?.message)
	}, [dataOrderContext?.status?.id])



		// SHOW COURIER
	const [hideCourier, setHideCourier] = useState(true)
	useEffect(() => {
		setHideCourier(true)
		if(dataOrderContext?.courier){
			setHideCourier(false)
		}
	}, [dataOrderContext])



		// REALTIME UPDATE
	const token = localStorage.getItem('token')
	const {useSocket, setRoleSocket} = useContext(SocketContext)
	useEffect(() => {
		setRoleSocket('user')
		if(token){
			if(useSocket?.connected){
				useSocket?.emit('subscribeOrderUser', dataOrderContext?.id_order)
				console.log('SUBSCRIBED')
			}else{
				useSocket?.once('connect', () => {
					useSocket?.emit('subscribeOrderUser', dataOrderContext?.id_order)
				})
			}

			useSocket?.on('updateStatusOrder', () => {
				getDataOrder()
				console.log('UPDATE WITH SOCKET')
			})
		}
		return () => {
			useSocket?.off('updateStatusOrder')
			useSocket?.off('connect')
		}
	}, [dataOrderContext, useSocket])



		// SET TOTAL ITEM
	const [totalQty, setTotalQty] = useState(0)
	useEffect(() => {
		const newTotalQty = (dataOrderContext?.items || []).reduce((sum, item) => {
			return sum+item.qty
		}, 0)
		setTotalQty(newTotalQty)
		console.log(totalQty)
	}, [dataOrderContext])



		// SET TOTAL PRICE
	const [total, setTotal] = useState(0)
	useEffect(() => {
		const totalPriceItems = (dataOrderContext?.items || []).reduce((sum, item) => {
			return sum+Number(item.total_price)
		}, 0)
		setTotal(Number(totalPriceItems)+Number(dataOrderContext?.shipping_cost)+Number(dataOrderContext?.service_cost))
		console.log(total)
	}, [dataOrderContext])



	// HANDLE CANCEL
	const navigate = useNavigate()
	const location = useLocation()
	const {setAlert} = useContext(AlertContext)
	const [loadingBtnCancel, setLoadingBtnCancel] = useState(false)
	const [orderCanceled, setOrderCanceled] = useState(false)
	const handleCancel = async () => {
		setLoadingBtnCancel(true)
		try{
			await reqCancel()
			setAlert({isOpen: true, status: 'success', message: 'Pesanan berhasil dibatalkan'})
			getDataOrder()
			setOrderCanceled(true)
		}catch(error){
			console.log(error)
			if(error.status === 401){
				localStorage.remove('token')
				navigate('/login', {state: {from: location}, replace: true})
			}
		}finally{
			setLoadingBtnCancel(false)
		}
	}



	if(loading){
		return 'Memuat . . .'
	}


	return (
		<>
		<Helmet>
		<title>Progres Order</title>
		</Helmet>
		{dataOrderContext ? (
			<div className={progressStyle.border}>
			<div className={progressStyle.box}>
			<div className={progressStyle.top}>
			<div className={progressStyle.left}>
			<div className={progressStyle.title}>
			<label>Status</label>
			</div>
			<div className={progressStyle.content}>
							{/*<div className={progressStyle.icon}>
								<img src="" alt="" />
							</div>*/}
			<div className={progressStyle.text}>
			<label>{status}</label>
			</div>
			{[1,4].includes(dataOrderContext?.status?.id) ? <button onClick={handleCancel} disabled={loadingBtnCancel}>{loadingBtnCancel ? 'Proses pembatalan . . .' : 'BATALKAN'}</button> : ''}
			</div>
			</div>
			<div className={progressStyle.middle}>
			<div className={clsx(progressStyle.cardCourier, hideCourier && progressStyle.hide)}>
			<div className={progressStyle.profile}>
			<img src={dataOrderContext?.courier?.image} />
			</div>
			<div className={progressStyle.info}>
			<h2>{dataOrderContext?.courier?.name || ''}</h2>
			<div className={progressStyle.vehicle}>
			<span className={progressStyle.plateNumber}>{dataOrderContext?.courier?.number_plate || ''}</span>
			<span>{dataOrderContext?.courier?.vehicle || ''} | {dataOrderContext?.courier?.vehicle_color || ''}</span>
			</div>
			</div>
			</div>
			<div className={progressStyle.cardMerchant}>
			<div className={progressStyle.cover}>
			{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${dataOrderContext?.merchant?.id}/${dataOrderContext?.merchant?.image}`} />*/}
			<img src={dataOrderContext?.merchant?.image} />
			</div>
			<div className={progressStyle.infoContainer}>
			<div className={progressStyle.info}>
			<h2>{dataOrderContext?.merchant?.name}</h2>
			<span>Ngebruk | 3 KM</span>
			</div>
			</div>
			</div>
			</div>
			</div>
			<div className={progressStyle.bottom}>
			<div className={progressStyle.right}>
			<div className={progressStyle.title}>
			<label>Daftar Pesanan</label>
			</div>
			<div className={progressStyle.content}>
			<div className={progressStyle.scrollArea}>
			{dataOrderContext?.items.map((item, key) => { return (
				<div className={progressStyle.row} key={key}>
				<div className={progressStyle.picture}>
				{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${dataOrderContext?.merchant?.id}/${item.image}`} alt="" />*/}
				<img src={item.image} alt="" />
				</div>
				<div className={progressStyle.info}>
				<div className={progressStyle.top}>
				<div className={progressStyle.left}>
				<h3>{item.name_menu}</h3>
				<h4>{item.variant}</h4>
				</div>
				<div className={progressStyle.right}>
				<h4>x {item.qty}</h4>
				</div>
				</div>
				<div className={progressStyle.bottom}>
				<label>{Number(item.total_price).toLocaleString('id-ID')}</label>
				</div>
				</div>
				</div>
				)})}
			<div className={progressStyle.rowPriceSystem}>
			<div className={progressStyle.left}>
			Ongkos kirim
			</div>
			<div className={progressStyle.right}>
			{Number(dataOrderContext?.shipping_cost).toLocaleString('id-ID')}
			</div>
			</div>
			<div className={progressStyle.rowPriceSystem}>
			<div className={progressStyle.left}>
			Biaya layanan
			</div>
			<div className={progressStyle.right}>
			1.000
			</div>
			</div>
			</div>
			<div className={progressStyle.total}>
			<div className={progressStyle.left}>
			<label>Total <span>({totalQty} item)</span></label>
			</div>
			<div className={progressStyle.right}>
			<h1>Rp {Number(total).toLocaleString('id-ID')}</h1>
			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
			) : orderCanceled ? (
			<div className={progressStyle.boxCanceled}>
			<i className='fa-solid fa-check'></i>
			<p>Pesanan Berhasil Dibatalkan</p>
			</div>
			) : (
			'Belum punya order'
			)}
			</>
			)
}

export default ProgressPage