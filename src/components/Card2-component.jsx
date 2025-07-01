import {useParams} from 'react-router-dom'
import clsx from 'clsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const Card2Component = ({onClick, data}) => {
	const {id_merchant} = useParams()

	return(
		<div className={clsx(merchantStyle.card, 'notHighlight')} onClick={onClick}>
		<div className={merchantStyle.cover}>
		{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${id_merchant}/${data.image}`} />*/}
		<img src={data.image} />
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