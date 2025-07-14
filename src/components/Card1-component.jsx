import homeStyle from '../styles/pages/Home.module.css'
import {Link} from 'react-router-dom'
import {CloudinaryOptimized} from '../helper/Cloudinary-optimized-helper.jsx'
// import image from '../../public/img/1.jpg'
const Card1Component = ({data}) => {
	// const idMerchant = {data.id}

	return(
		<Link to={`/menu/${data.id}`}>
		<div className={homeStyle.card}>
		<div className={homeStyle.cover}>
		{/*<img src="/img/1.jpg" />*/}
		{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${data.id}/${data.image}`} />*/}
		<img src={CloudinaryOptimized(data.image)} />
		{!data.is_open ? (
			<span>TUTUP</span>
			) : ''}
		</div>
		<div className={homeStyle.infoMerchant}>
		<h2>{data.name}</h2>
		{/*<h3>{data.address} | 2 km</h3>*/}
		{/*<h3>{data.distance ? data.distance+' km' : ''}</h3>*/}
		<h3></h3>
		<div className={homeStyle.rating}>
		<div className={homeStyle.star}>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="far fa-star"></i>
		</div>
		<h3 className={homeStyle.count}>(100)</h3>
		</div>
		</div>
		</div>
		</Link>
		)
}

export default Card1Component