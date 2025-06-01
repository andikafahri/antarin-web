import merchantStyle from '../styles/pages/Merchant.module.css'

const Card2Component = ({onClick, data}) => {
	return(
		<div className={merchantStyle.card} onClick={onClick}>
		<div className={merchantStyle.cover}>
		<img src="/img/1.jpg" />
		</div>
		<div className={merchantStyle.infoMerchant}>
		<h2>{data.name}</h2>
		<div className={merchantStyle.price}>
		<h3>{Number(data.price).toLocaleString('id-ID')}</h3>
		</div>
		</div>
		</div>
		)
}

export default Card2Component