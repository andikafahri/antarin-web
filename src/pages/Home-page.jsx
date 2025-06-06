import {useState,useEffect, useMemo, useRef, useContext} from 'react'
import {Link, useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import debounce from 'lodash.debounce'
import homeStyle from '../styles/pages/Home.module.css'
import socket from '../function/Socket-function.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import Card1Component from '../components/Card1-component.jsx'
import CheckoutComponent from '../components/Checkout-component.jsx'
import FooterComponent from '../components/Footer-component.jsx'
import {getMerchantList} from '../api.jsx'

const HomePage = () => {
	// GET STATUS ORDER
	const {loadingDataOrder, getDataOrder, dataOrderContext} = useContext(OrderContext)
	const [statusOrder, setStatusOrder] = useState({})

	useEffect(() => {
		const result = async () => {
			await getDataOrder()
		}

		result()
	}, [])

	const navigate = useNavigate()
	// useEffect(() => {
	// 	const token = localStorage.getItem('token')
	// 	if(!token){
	// 		navigate('/login')
	// 		return
	// 	}
	// })
	// const [params] = useSearchParams()
	const location = useLocation()
	const params = new URLSearchParams(location.search)
	const searchParam = params.get('search')
	const categoryParam = params.get('category')

	const setFilterParams = ({name, category}) => {
		if(name){
			params.set('search', name)
		}else{
			params.delete('search')
		}

		if(category){
			params.set('category', category)
		}else{
			params.delete('category')
		}

		navigate(`?${params.toString()}`, {replace: true})
	}

	const searchInput = useRef()
	const [searchValue, setSearchValue] = useState('')
	const delaySearch = useMemo(() => 
		debounce((val) => {
			setFilterParams({name: val, category: categoryParam})
		}, 500), [searchValue])

	useEffect(() => {
		delaySearch(searchValue)
		return() => delaySearch.cancel()
	}, [searchValue])

	const btnClear = () => {
		setSearchValue('')
	}

	const filter = useMemo(() => ({
		search: searchParam,
		category: categoryParam
	}), [searchParam, categoryParam])
	const [merchantList, setMerchantList] = useState([])
	useEffect(() => {
		getMerchantList(filter).then((result) => {
			setMerchantList(result)
		})
		setMerchantList(null)
	}, [filter])

	const MerchantList = () => {
		if(!merchantList){
			return <div className={homeStyle.loading}>Memuat . . .</div>
		}

		if(merchantList.length === 0){
			return <div className={homeStyle.loading}><div>Data Kosong</div></div>
		}

		return merchantList.map((merchant) => {
			return (
				<Card1Component key={merchant.id} data={merchant}/>
				)
		})
	}



	// REALTIME UPDATE STATUS ORDER
	useEffect(() => {
		if(dataOrderContext){
			setStatusOrder(dataOrderContext?.status)
			console.log('HOME MOUNT AGAIN')
			console.log(statusOrder)
			console.log(dataOrderContext)

			socket.emit('subscribeToOrder', dataOrderContext?.id_order)
			socket.on('updateStatusOrder', (data) => {
			// getDataOrder()
				setStatusOrder(data?.status)
				console.log('UPDATE REALTIME')
				console.log(data)
			})
			return () => {
				socket.off('updateStatusOrder')
			}
			console.log('UPDATE STATUS ORDER VIA SOCKET')
		}
	}, [dataOrderContext, loadingDataOrder])

	const handleProgress = () => {
		navigate('/progress')
	}

	const {cartItems} = useContext(OrderContext)
	console.log('Cart Items: '+cartItems.length)

	if(loadingDataOrder){
		return 'Memuat . . .'
	}

	return (
		<div>
		{/*<HeaderComponent />*/}

		<div className={homeStyle.info}>
		<div className={homeStyle.progress} role='button' onClick={handleProgress}>
		{/*<label>Sedang Diantar</label>*/}
		<label>{statusOrder?.message || 'Order Sekarang'}</label>
		</div>
		<div className={homeStyle.point}>
		<label>Poin</label>
		<p>5000</p>
		</div>
		</div>

		<div className={homeStyle.content}>
		<div className={homeStyle.searchBar2}>
		<input type="text" ref={searchInput} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Cari Di sini" />
		<button type="button" className={homeStyle.btnClear} onClick={btnClear} disabled={searchValue.trim() === ''}>Hapus</button>
		</div>
		<div className={homeStyle.headerContent}>
		<h1 className={homeStyle.title}>Rekomendasi</h1>
		<div className={homeStyle.category}>
		<Link onClick={(e) => {
			e.preventDefault()
			setFilterParams({name: searchParam})
		}} className={!categoryParam && homeStyle.active}>Semua</Link>
		<Link className={categoryParam === 'makanan' ? homeStyle.active : ''} onClick={(e) => {
			e.preventDefault()
			setFilterParams({name: searchParam, category: 'makanan'})
		}}>Makanan</Link>
		<Link className={categoryParam === 'minuman' ? homeStyle.active : ''} onClick={(e) => {
			e.preventDefault()
			setFilterParams({name: searchParam, category: 'minuman'})
		}}>Minuman</Link>
		</div>
		</div>
		<div className={homeStyle.cardsGroup}>
		<MerchantList />
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
		<MerchantList />
		</div>
		</div>

		{cartItems.length !== 0 ? <CheckoutComponent /> : ''}

		<FooterComponent />
		</div>
		)
}

export default HomePage