import {useParams} from 'react-router-dom'
import clsx from 'clsx'
import s from '../styles/pages/Merchant.module.css'

const Card2Component = ({onClick, data}) => {
	const {id_merchant} = useParams()

	return(
		<div role='button' className={clsx(s.card, 'notHighlight')} onClick={onClick}>
		{data.is_ready ? (<span className={s.ready}>Tersedia</span>) : (<span className={s.notReady}>Tidak Tersedia</span>)}
		<div className={s.picture}>
		<img src={data.image} alt="" />
		</div>
		<div className={s.info}>
		<h2>{data.name}</h2>
		<h3>{Number(data.price).toLocaleString('id-ID')}</h3>
		</div>
		</div>
		)
}

export default Card2Component