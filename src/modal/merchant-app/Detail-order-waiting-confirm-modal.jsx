import {useState, useContext} from 'react'
import {CloudinaryOptimized} from '../../helper/Cloudinary-optimized-helper.jsx'
import clsx from 'clsx'
import {AlertContext} from '../../context/Alert-context.jsx'
import {reqAccept, reqReject} from '../../api-merchant-app.jsx'
import d from '../../styles/modal/merchant-app/Detail-order-waiting-confirm-modal.module.css'

const DetailOrderWaitingConfirmModal = ({isOpen, onClose, data}) => {
	const {setAlert} = useContext(AlertContext)

	// LIST ITEM COMPONENT
	const ListItem = () => {
		return data?.items?.map((item, i) => {
			return (
				<div className={d.row} key={i}>
				<div className={d.picture}>
				<img src={CloudinaryOptimized(item.image)} alt="" />
				</div>
				<div className={d.info}>
				<div className={d.top}>
				<div className={d.left}>
				<h3>{item.name}</h3>
				<h4>{item.variant}</h4>
				</div>
				<div className={d.right}>
				<h4>x {item.qty}</h4>
				</div>
				</div>
				<div className={d.bottom}>
				<label>{Number(item.total_price).toLocaleString('id-ID')}</label>
				</div>
				</div>
				</div>
				)
		})
	}



	// HANDLE ACCEPT
	const [loading, setLoading] = useState(false)
	const accept = (id_order) => {
		setLoading(true)
		reqAccept(id_order).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Berhasil. Harap segera proses pesanan!'})
			onClose()
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		}).finally(() => {
			setLoading(false)
		})
	}



	// HANDLE REJECT
	const reject = (id_order) => {
		setLoading(true)
		reqReject(id_order).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Pesanan berhasil ditolak'})
			onClose()
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
				return
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}})
			}else{
				setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
			}
			console.log(error)
		}).finally(() => {
			setLoading(false)
		})
	}

	return (
		<>
		<div role='button' className={clsx(d.modal, isOpen && d.open)} onClick={(e) => {if(e.target === e.currentTarget) onClose()}}>
		<div className={d.box}>
		<span role='button' className='notHighlight' onClick={onClose}><i className='fas fa-close'></i></span>
		<div className={d.title}>
		<label>DETAIL</label><br/>
		<span>Menunggu Konfirmasi</span>
		</div>
		<div className={d.body}>
		<div className={d.buyer}>
		<div className={d.profile}>
		<img src={CloudinaryOptimized(data?.image)} />
		</div>
		<div className={d.info}>
		<h2>{data?.user}</h2>
		<h3>{data?.destination}</h3>
		</div>
		</div>
		<div className={d.list}>
		<ListItem />
		</div>
		<div className={d.total}>
		<div className={d.left}>
		<label>Total <span>({
			data?.items?.reduce((sum, item) => {
				return sum + item.qty
			}, 0)
		} item)</span></label>
		</div>
		<div className={d.right}>
		<label>Rp {
			Number(data?.items?.reduce((sum, item) => {
				return sum + item.total_price
			}, 0)).toLocaleString('id-ID')
		}</label>
		</div>
		</div>
		</div>
		<div className={d.footer}>
		<button className={d.btnReject} onClick={() => {reject(data.id_order)}} disabled={loading}>TOLAK</button>
		<button className='btn-primary' onClick={() => {accept(data.id_order)}} disabled={loading}>TERIMA</button>
		</div>
		</div>
		</div>
		</>
		)
}

export default DetailOrderWaitingConfirmModal