import {useEffect, useState, useMemo, useContext} from 'react'
import {useParams} from 'react-router-dom'
import clsx from 'clsx'
import {CloudinaryOptimized} from '../helper/Cloudinary-optimized-helper.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import {getDetailMenu} from '../api.jsx'
import s from '../styles/modal/Edit-menu.module.css'

const ModalEditMenu = ({isOpen, onClose, selected}) => {
	const {cartItems, setCartItems} = useContext(OrderContext)
	const [qty, setQty] = useState(null)
	const [variantItemSelected, setVariantItemSelected] = useState({})
	const [data, setData] = useState({})
	const getDetail = (idMenu) => {
		getDetailMenu(idMenu).then(result => {
			setData(result)
		}).catch(error => {

		}).finally(() => {

		})
	}

	useEffect(() => {
		getDetail(selected.id)
	}, [selected])

	useEffect(() => {
		setVariantItemSelected(selected?.variant || {})
		setQty(selected?.qty || null)
	}, [data])

	const VariantComponent = () => {
		if(data.variants){
			return Object.values(data.variants).map(variant => {
				return (
					<div key={variant.name}>
					<h2>{variant.name}</h2>
					<div className={s.listVariant}>
					{variant.items.map(item => (
						<div key={item.id}>
						<label className={`${!item.is_ready ? s.disabled : variantItemSelected.id === item.id ? s.active : ''}`}><input type="radio" hidden checked={variantItemSelected.id === item.id} onChange={() => setVariantItemSelected(item)} />{item.name}</label>
						</div>
						))}
					</div>
					</div>
					)
			})
		}else{
			return (
				<div>
				<h2 className={s.loadingBg}></h2>
				<div className={s.listVariant}>
				<label className={s.loadingBg}></label>
				<label className={s.loadingBg}></label>
				<label className={s.loadingBg}></label>
				</div>
				</div>
				)
		}
	}
	const VariantItemComponent = () => {
		if(Object.keys(variantItemSelected).length === 0){
			return null
		}

		return (
			<>
			<span>
			<label htmlFor="">{variantItemSelected.name}</label>
			<h4>{variantItemSelected.price}</h4>
			</span>
			</>
			)
	}



					// QTY
	
	const handleQty = (qtyValue) => {
		setQty(qtyValue)
	}

	const decrease = () => { setQty(prev => Math.max(1, prev-1))}
	const increase = () => { setQty(prev => prev+1)}

	const handleUpdate = () => {
		const find = cartItems.find(i => i.id === selected.id)
		if(find){
			setCartItems(prev => prev.map(item =>
				item.id === selected.id ? {
					...item,
					qty: qty,
					variant: variantItemSelected
				} : item
				))
		}
		onClose()
	}

	const handleDelete = () => {
		setCartItems(prev => prev.filter(item => item.id !== selected.id))
		onClose()
	}

	return (
		<>
		<div className={clsx(s.modal, isOpen && s.open)} role='button' onClick={(e) => {
			if(e.target === e.currentTarget){onClose()}
		}}>
	<div className={s.modalDetailMenu}>
	<div className={s.cover}>
	<img src={CloudinaryOptimized(data?.image)} alt="" />
	</div>
	<div className={s.body}>
	<h1>{data?.name}</h1>
	<p>{data?.detail}</p>
	<div className={s.variant}>
	<VariantComponent />
	</div>
	</div>
	<div className={s.detailOrder}>

	</div>
	<div className={s.footerDetailMenu}>
	<div className={s.infoPrice}>
	<span>
	<label htmlFor="">{data?.name}</label>
	<h4>{Number(data?.price).toLocaleString('id-ID')}</h4>
	</span>
	<VariantItemComponent />
	</div>
	<div className={s.qtyGroup}>
	<button className='btn-second' onClick={decrease}><i className='fas fa-minus'></i></button>
	<input type="number" value={qty} onChange={(e) => handleQty(Math.max(1, parseInt(e.target.value)))}/>
	<button className='btn-primary' onClick={increase}><i className='fas fa-plus'></i></button>
	</div>
	<div className={s.buttonGroup}>
	<button className="btn-second" onClick={onClose}>TUTUP</button>
	<button className={clsx(s.btnDelete, 'btn-danger')} onClick={handleDelete}>HAPUS</button>
	<button className="btn-primary" onClick={handleUpdate}>SIMPAN</button>
	</div>
	</div>
	</div>
	</div>
	</>
	)

}

export default ModalEditMenu