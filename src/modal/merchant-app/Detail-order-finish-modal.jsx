import {useState, useContext} from 'react'
import d from '../../styles/modal/merchant-app/Detail-order-finish-modal.module.css'
import clsx from 'clsx'

const DetailOrderFinish = ({isOpen, onClose, data, status}) => {
	// LIST ITEM COMPONENT
	const ListItem = () => {
		return data?.items?.map((item, i) => {
			return (
				<div className={d.row} key={i}>
				<div className={d.picture}>
				<img src='/img/mi-chili-oil.jpg' alt="" />
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
	console.log()
	const Status = () => {
		if(status === 'waitingCourier'){
			return (
				<>
				<span><i className='fas fa-clock'></i> Menunggu kurir mengambil pesanan</span>
				</>
				)
		}else if(status === 'pickUp'){
			return (
				<>
				{/*<span><i className='fas fa-shipping-fast'></i> Pesanan diantar ke tujuan</span>*/}
				<span><i className='fas fa-clipboard-check'></i> Pesanan diambil kurir</span>
				</>
				)
		}else{
			return null
		}
	}

	return (
		<>
		<div role='button' className={clsx(d.modal, isOpen && d.open)} onClick={(e) => {if(e.target === e.currentTarget) onClose()}}>
		<div className={d.box}>
		<span role='button' className='notHighlight' onClick={onClose}><i className='fas fa-close'></i></span>
		<div className={d.title}>
		<label>DETAIL</label><br/>
		<span>Pesanan Selesai</span>
		</div>
		<div className={d.body}>
		<div className={d.entity}>
		<label>Pembeli</label>
		<div className={d.buyer}>
		<div className={d.profile}>
		<img src="/img/profile.jpg" />
		</div>
		<div className={d.info}>
		<h2>{data?.user}</h2>
		<h3>{data?.destination}</h3>
		</div>
		</div>
		<label>Kurir</label>
		<div className={d.courier}>
		<div className={d.profile}>
		<img src="/img/profile.jpg" />
		</div>
		<div className={d.info}>
		<h2>{data?.courier?.name}</h2>
		</div>
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
		<Status />
		</div>
		</div>
		</div>
		</>
		)
}

export default DetailOrderFinish