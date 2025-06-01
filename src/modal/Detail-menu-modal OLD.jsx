import {useEffect, useState, useMemo} from 'react'
import clsx from 'clsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const ModalDetailMenu = ({isOpen, onClose, data}) => {
	data = data || {}
	const [variant, setVariant] = useState(null)
	useEffect(() => {
		setVariant(data.variants)
	}, [data])

	const VariantElement = () => {
		if(variant){
			return Object.values(variant).map(variant => {
				return (
					<div key={variant.name}>
					<h2>{variant.name}</h2>
					<div className={merchantStyle.listVariant}>
					{/*<ItemVariantElement variant={variant}/>*/}
					{variant.items.map(item => (
						<div key={item.id}>
						<input type="radio" hidden />
						<label htmlFor="level1">{item.name}</label>
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
	// const VariantElement = () => {
	
		// return variant?.map(variant => {
		// 	return (
		// 		<div key={variant.name}>
		// 		<h2>{variant.name}</h2>
		// 		<div className={merchantStyle.listVariant}>
		// 		{/*<ItemVariantElement variant={variant.name}/>*/}
		// 		</div>
		// 		</div>
		// 		)
		// })
	// }

	

	const ItemVariantElement = ({variant}) => {
		return variant.items.map(item => {
			return (
				<>
				<input type="radio" hidden />
				<label htmlFor="level1">{item.name}</label>
				</>
				)
		})
	}

	return (
		<div className={clsx(merchantStyle.modal, isOpen && merchantStyle.open)} role='button' onClick={(e) => {
			if(e.target === e.currentTarget){onClose()}
		}}>
	<div className={merchantStyle.modalDetailMenu}>
	<div className={merchantStyle.cover}>
	<img src="/img/1.jpg" alt="" />
	</div>
	<div className={merchantStyle.body}>
	<h1>{data.name}</h1>
	<p>{data.detail}</p>
	<div className={merchantStyle.variant}>
	<VariantElement />
	</div>
	</div>
	<div className={merchantStyle.detailOrder}>

	</div>
	<div className={merchantStyle.footerDetailMenu}>
	<div className={merchantStyle.infoPrice}>
	<span>
	<label htmlFor="">Mi Chili Oil</label>
	<h4>10.000</h4>
	</span>
	<span>
	<label htmlFor="">Level 3</label>
	<h4>1.000</h4>
	</span>
	<span>
	<label htmlFor="">Jumlah</label>
	<h4>2</h4>
	</span>
	<span className={merchantStyle.total}>
	<label htmlFor="">Total Harga : </label>
	<h4>Rp 22.000</h4>
	</span>
	</div>
	<div className={merchantStyle.buttonGroup}>
	<button className="btn-second" onClick={onClose}>BATAL</button>
	<button className="btn-primary">TAMBAH</button>
	</div>
	</div>
	</div>
	</div>
	)
}

export default ModalDetailMenu