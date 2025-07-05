import {useEffect, useState, useMemo, useContext} from 'react'
import {useParams} from 'react-router-dom'
import clsx from 'clsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import AlertComponent from '../components/Alert-component.jsx'
import ConfirmChangeCartModal from '../modal/Confirm-change-cart-modal.jsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const ModalDetailMenu = ({isOpen, onClose, nameMerchant, data, cart}) => {
	

	// data = data || {}
	const [variant, setVariant] = useState({})
	useEffect(() => {
		setVariant(data.variants)
		setVariantItemSelected({})
		setQty(1)
	}, [isOpen])

	const [variantItemSelected, setVariantItemSelected] = useState({})
	const VariantComponent = () => {
		if(variant){
			return Object.values(variant).map(variant => {
				return (
					<div key={variant.name}>
					<h2>{variant.name}</h2>
					<div className={merchantStyle.listVariant}>
						{/*<ItemVariantComponent variant={variant}/>*/}
					{variant.items.map(item => (
						<div key={item.id}>
						<label className={`${!item.is_ready ? merchantStyle.disabled : variantItemSelected.id === item.id ? merchantStyle.active : ''}`}><input type="radio" hidden checked={variantItemSelected.id === item.id} onChange={() => setVariantItemSelected(item)} />{item.name}</label>
						</div>
						))}
					</div>
					</div>
					)
			})
		}else{
			return (
				<div>
				<h2 className={merchantStyle.loadingBg}></h2>
				<div className={merchantStyle.listVariant}>
				<label className={merchantStyle.loadingBg}></label>
				<label className={merchantStyle.loadingBg}></label>
				<label className={merchantStyle.loadingBg}></label>
				</div>
				</div>
				)
		}
	}
	// const VariantComponent = () => {

		// return variant?.map(variant => {
			// 	return (
			// 		<div key={variant.name}>
				// 		<h2>{variant.name}</h2>
				// 		<div className={merchantStyle.listVariant}>
					// 		{/*<ItemVariantComponent variant={variant.name}/>*/}
				// 		</div>
			// 		</div>
			// 		)
			// })
			// }



			// const ItemVariantComponent = ({variant}) => {
				// 	return variant.items.map(item => {
					// 		return (
					// 			<>
					// 			<label className={`${variantItemSelected.id === item.id ? merchantStyle.active : ''}`}><input type="radio" hidden onChange={() => setVariantItemSelected(item.name)} />{item.name}</label>
					// 			</>
					// 			)
					// 	})
					// }




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



					// ADD ITEM
	const [qty, setQty] = useState(1)
	const handleQty = (qtyValue) => {
						// setQty(prev => ({
							// 	...prev,
							// 	[menuId]: parseInt(qty)
							// }))
		setQty(qtyValue)
	}

	const decrease = () => { setQty(prev => Math.max(1, prev-1))}
	const increase = () => { setQty(prev => prev+1)}

	const {idMerchant, setIdMerchant, setNameMerchant, addToCart} = useContext(OrderContext)
	const {id_merchant} = useParams()
	const {alert, setAlert} = useContext(AlertContext)
	const [isOpenConfirm, setIsOpenConfirm] = useState(false)
	const [newItemForChange, setNewItemForChange] = useState({})
	const addItem = ({data, qtyItem}) => {
		if(!variantItemSelected.id || !variantItemSelected.name){
			setAlert({isOpen: true, status: 'warning', message: 'Harap pilih varian dahulu'})
			return
		}

		if(!qty || qty < 1){
			setAlert({isOpen: true, status: 'warning', message: 'Jumlah item minimal 1'})
			return
		}

		const item = {
			id: data.id,
			name: data.name,
			price: data.price,
			qty: qtyItem,
			image: data.image,
			variant: {
				id: variantItemSelected.id,
				name: variantItemSelected.name,
				price: variantItemSelected.price
			}
		}
		console.log('Id Merchant: '+idMerchant)
		console.log('Id Merchant Current: '+id_merchant)
		if(idMerchant && idMerchant !== id_merchant){
			// setAlert({isOpen: true, status: 'warning', message: 'Ganti item sebelumnya dengan item dari merchant ini?'})
			setNewItemForChange(item)
			setIsOpenConfirm(true)
			return
		}

		console.log(item)
		setIdMerchant(id_merchant)
		setNameMerchant(nameMerchant)
		addToCart(item)
		onClose()
	}



	// GET ORDER
	const {dataOrderContext} = useContext(OrderContext)



	// CLOSE MODAL CONFIRM
	const handleCloseModalConfirm = () => {
		setIsOpenConfirm(false)
	}

	// HANDLE CONFIRM
	const handleConfirm = () => {
		setIsOpenConfirm(false)
		setIdMerchant(id_merchant)
		setNameMerchant(nameMerchant)
		onClose()
	}



	return (
		<>
		<AlertComponent isOpen={alert.isOpen} status={alert.status} message={alert.message} />
		<div className={clsx(merchantStyle.modal, isOpen && merchantStyle.open)} role='button' onClick={(e) => {
			if(e.target === e.currentTarget){onClose()}
		}}>
	<div className={merchantStyle.modalDetailMenu}>
	<div className={merchantStyle.cover}>
	{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${id_merchant}/${data.image}`} alt="" />*/}
	<img src={data.image} alt="" />
	</div>
	<div className={merchantStyle.body}>
	{!data.is_ready ? (
		<label className={merchantStyle.notReady}>Tidak Tersedia</label>
		) : ''}
	<h1>{data.name}</h1>
	<p>{data.detail}</p>
	<div className={merchantStyle.variant}>
	<VariantComponent />
	</div>
	</div>
	<div className={merchantStyle.detailOrder}>

	</div>
	<div className={merchantStyle.footerDetailMenu}>
	<div className={merchantStyle.infoPrice}>
	<span>
	<label htmlFor="">{data.name}</label>
	<h4>{Number(data.price).toLocaleString('id-ID')}</h4>
	</span>
	<VariantItemComponent />
	</div>
	<div className={merchantStyle.qtyGroup}>
	<button className='btn-second' onClick={decrease}><i className='fas fa-minus'></i></button>
	<input type="number" value={qty} onChange={(e) => handleQty(Math.max(1, parseInt(e.target.value)))}/>
	<button className='btn-primary' onClick={increase}><i className='fas fa-plus'></i></button>
	</div>
	<div className={merchantStyle.buttonGroup}>
	<button className="btn-second" onClick={onClose}>BATAL</button>
	<button className="btn-primary" onClick={() => addItem({data: data, qtyItem: qty})} disabled={!!dataOrderContext?.id_order || !data.is_ready}>TAMBAH</button>
	</div>
	</div>
	</div>
	</div>

	<ConfirmChangeCartModal isOpen={isOpenConfirm} onClose={handleCloseModalConfirm} newItem={newItemForChange} onConfirm={handleConfirm} />
	</>
	)

}

export default ModalDetailMenu