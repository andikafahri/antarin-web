import {useState, useEffect, useMemo, useRef, useContext} from 'react'
import {Link, useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import debounce from 'lodash.debounce'
import homeStyle from '../styles/pages/Home.module.css'
import socket from '../function/Socket-function.jsx'
import {AccountContext} from '../context/Account-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import {SocketContext} from '../context/Socket-context.jsx'
import Card1Component from '../components/Card1-component.jsx'
import CheckoutComponent from '../components/Checkout-component.jsx'
import FooterComponent from '../components/Footer-component.jsx'
import {getMerchantList} from '../api.jsx'

const MerchantList = ({data}) => {
	return data?.map((merchant) => {
		return (
			<Card1Component key={merchant.id} data={merchant}/>
			)
	})
}


const HomePage = () => {
	const navigate = useNavigate()
	const {cartItems} = useContext(OrderContext)
	const {loadingProfileCtx, profileCtx} = useContext(AccountContext)
	const [filter, setFilter] = useState({})
	const [loadingMerchantList, setLoadingMerchantList] = useState(true)
	const [merchantList, setMerchantList] = useState([])

	useEffect(() => {
		setLoadingMerchantList(true)
		getMerchantList(filter).then((result) => {
			setMerchantList(result)
		}).finally(() => {
			setLoadingMerchantList(false)
		})
	}, [filter])

	// GET STATUS ORDER
	const {loadingDataOrder, getDataOrder, dataOrderContext} = useContext(OrderContext)
	const [statusOrder, setStatusOrder] = useState({})

	useEffect(() => {
		getDataOrder()
	}, [])
	// ===

	// REALTIME UPDATE STATUS ORDER
	const token = localStorage.getItem('token')
	const {useSocket, setRoleSocket} = useContext(SocketContext)
	useEffect(() => {
		setRoleSocket('user')
		if(token && dataOrderContext){
			setStatusOrder(dataOrderContext?.status)
			if(useSocket?.connected){
				useSocket?.emit('subscribeOrderUser', dataOrderContext?.id_order)
			}else{
				useSocket?.once('connect', () => {
					useSocket?.emit('subscribeOrderUser', dataOrderContext?.id_order)
				})
			}

			useSocket?.on('updateStatusOrder', (data) => {
				setStatusOrder(data?.status)
			})
			return () => {
				useSocket?.off('updateStatusOrder')
				useSocket?.off('connect')
			}
		}
	}, [dataOrderContext, loadingDataOrder])
	// ===

	// SEARCH
	const searchInput = useRef()
	const [searchValue, setSearchValue] = useState('')
	const delaySearch = useMemo(() => 
		debounce((val) => {
			setFilter(prev => ({...prev, search: val}))
		}, 500), [searchValue])

	useEffect(() => {
		delaySearch(searchValue)
		return() => delaySearch.cancel()
	}, [searchValue])

	const btnClear = () => {
		setSearchValue('')
	}
	// ===

	

	const handleProgress = () => {
		navigate('/progress')
	}

	if(loadingDataOrder || loadingProfileCtx){
		return 'Memuat . . .'
	}

	return (
		<div>
		{Object.keys(profileCtx).length > 0 ? (
			<div className={homeStyle.info}>
			<div className={homeStyle.progress} role='button' onClick={handleProgress}>
			<label>{statusOrder?.message || 'Order Sekarang'}</label>
			</div>
			<div className={homeStyle.point}>
			<label>Poin</label>
			<p>{profileCtx.poin}</p>
			</div>
			</div>
			) : ''}

		<div className={homeStyle.content}>
		<div className={homeStyle.searchBar2}>
		<input type="text" ref={searchInput} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Cari Di sini" />
		<button type="button" className={homeStyle.btnClear} onClick={(btnClear)} disabled={searchValue.trim() === ''}>Hapus</button>
		</div>
		<div className={homeStyle.headerContent}>
		<h1 className={homeStyle.title}>Rekomendasi</h1>
		<div className={homeStyle.category}>
		<Link onClick={(e) => {
			e.preventDefault()
			setFilter(prev => {
				const {category, ...prevFilter} = prev
				return prevFilter
			})
		}} className={!filter?.category && homeStyle.active}>Semua</Link>
		<Link className={filter?.category === 'makanan' ? homeStyle.active : ''} onClick={(e) => {
			e.preventDefault()
			setFilter(prev => ({...prev, category: 'makanan'}))
		}}>Makanan</Link>
		<Link className={filter?.category === 'minuman' ? homeStyle.active : ''} onClick={(e) => {
			e.preventDefault()
			setFilter(prev => ({...prev, category: 'minuman'}))
		}}>Minuman</Link>
		</div>
		</div>
		<div className={homeStyle.cardsGroup}>
		{loadingMerchantList ? (
			<div className={homeStyle.loading}>Memuat . . .</div>
			) : merchantList.length !== 0 ? (
			<MerchantList data={merchantList} />
			) : (
			<div className={homeStyle.loading}><div>Data Kosong</div></div>
			)}
			</div>


			<div className={homeStyle.headerContent}>
			<h1 className={homeStyle.title}>Terdekat</h1>
			<div className={homeStyle.category}>
			<a href="" className={homeStyle.active}>Semua</a>
			<a href="">Makanan</a>
			<a href="">Minuman</a>
			</div>
			</div>
			<div className={homeStyle.cardsGroup}>
			{loadingMerchantList ? (
				<div className={homeStyle.loading}>Memuat . . .</div>
				) : merchantList.length !== 0 ? (
				<MerchantList data={merchantList} />
				) : (
				<div className={homeStyle.loading}><div>Data Kosong</div></div>
				)}
				</div>
				</div>

				{cartItems.length !== 0 ? <CheckoutComponent /> : ''}

				<FooterComponent />
				</div>
				)
}

export default HomePage