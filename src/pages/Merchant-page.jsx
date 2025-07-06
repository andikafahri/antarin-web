import {useState, useEffect, useMemo, useRef, useContext, Suspense, lazy} from 'react'
import clsx from 'clsx'
import {Link, useSearchParams, useParams, useNavigate, useLocation, useNavigationType} from 'react-router-dom'
import debounce from 'lodash.debounce'
import {Helmet} from 'react-helmet'
import {CloudinaryOptimized} from '../helper/Cloudinary-optimized-helper.jsx'
import socket from '../function/Socket-function.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import {SocketContext} from '../context/Socket-context.jsx'
import {getCurrentMerchant, getMenuList, getSystemCost, reqCheckout, getTimeOperational} from '../api.jsx'
import merchantStyle from '../styles/pages/Merchant.module.css'
import AlertComponent from '../components/Alert-component.jsx'
import Card2Component from '../components/Card2-component.jsx'
import CheckoutComponent from '../components/Checkout-component.jsx'
import FooterComponent from '../components/Footer-component.jsx'
import ModalDetailMenu from '../modal/Detail-menu-modal.jsx'

const LazyTimeOperational = lazy(() => import ('../modal/Time-operational-modal.jsx'))

const MenuByCategoryList = ({menu_list, handleDetail}) => {
	if(!menu_list){
		return <div className={merchantStyle.loading}>Memuat . . .</div>
	}

	if(menu_list.length === 0){
		return <div className={merchantStyle.loading}><div>Data Kosong</div></div>
	}

	return menu_list?.map(category => {
		return (
			<div key={category.id}>
			<div className={merchantStyle.headerContent}>
			<h1 className={merchantStyle.title}>{category.name}</h1>
			</div>
			<div className={merchantStyle.cardsGroup}>
			{Object.values(category?.menus).map(menu => (
				<Card2Component key={menu.id} data={menu} role='button' onClick={() => handleDetail({menu})}/>
				))}
			</div>
			</div>
			)
	})
}

const MerchantPage = () => {
	const {setAlert} = useContext(AlertContext)
	const {id_merchant} = useParams()
	const [params] = useSearchParams()
	const searchParams = params.get('search')
	const categoryParams = params.get('category')
	
	// QUERY GENERATOR
	const navigate = useNavigate()
	const location = useLocation()
	const queryFilter = ({name, category}) => {
		const query = new URLSearchParams(location.search)

		if(name){
			query.set('search', name)
		}else{
			query.delete('search')	
		}

		if(category){
			query.set('category', category)
		}else{
			query.delete('category')	
		}

		navigate(`?${query.toString()}`, {replace: true})
	}



			// SEARCH
	const searchInput = useRef()
	const [searchValue, setSearchValue] = useState('')

	const clearButton = () => {
		setSearchValue('')
	}

	const debouncedSearch = useMemo(() => 
		debounce((val) => {
			queryFilter({name: val, category: categoryParams})
		}, 500),
		[categoryParams])

	useEffect(() => {
		debouncedSearch(searchValue)
		return () => debouncedSearch.cancel()
	}, [searchValue])



				// GET SYSTEM COST
	const {destinationSelected} = useContext(DestinationContext)
	const [shippingCost, setShippingCost] = useState(0)
	const [serviceCost, setServiceCost] = useState(0)
	useEffect(() => {
		if(!destinationSelected) return
			getSystemCost(destinationSelected).then(result => {
				setShippingCost(result.data.data.shipping_cost)
				setServiceCost(result.data.data.service_cost)
			}).catch(error => {
				console.log(error.response.data.errors)
			})
		}, [destinationSelected])



				// GET INFO MERCHANT AND CATEGORY TAB
	const [currentMerchant, setCurrentMerchant] = useState(null)
	useEffect(() => {
		console.log('Mounted at:', location.pathname);
		getCurrentMerchant(id_merchant).then((result) => {
			setCurrentMerchant(result)
		})
	}, [id_merchant])

	const TabCategory = () => {
		return (
			<>
			<Link onClick={(e) => {
				e.preventDefault()
				queryFilter({name: searchParams})
			}} className={!categoryParams ? merchantStyle.active : ''}>Semua</Link>
			{currentMerchant?.categorys.map(category => (
				<Link to='#' onClick={(e) => {
					e.preventDefault()
					queryFilter({name: searchParams, category: category.name})
				}} className={categoryParams === category.name ? merchantStyle.active : ''} key={category.id}>{category.name}</Link>
				))}
			</>
			)
	}



				// GET MENU
	const filter = useMemo(() => (
	{
		search: searchParams,
		category: categoryParams
	}
	), [params])

	const [menuList, setMenuList] = useState(null)
	useEffect(() => {
		console.log('Mounted 2 at:', location.pathname);
		setMenuList(null)
		getMenuList(id_merchant, filter).then((result) => {
			setMenuList(result)
		})
	}, [id_merchant, filter])







						// GET STATUS ORDER
	const [statusOrder, setStatusOrder] = useState({})
	const {getDataOrder, dataOrderContext} = useContext(OrderContext)
	const messageStatus = {
		1: 'Pesanan telah dibuat. Menunggu konfirmasi dari merchant',
		2: 'Pesanan diproses merchant',
		5: 'Kurir mengambil pesanan'
	}

	useEffect(() => {
		getDataOrder()
		console.log('MERCHANT PAGE MOUNT AGAIN')
		console.log(dataOrderContext)
	}, [])

	const token = localStorage.getItem('token')
	const {useSocket, setRoleSocket} = useContext(SocketContext)
	useEffect(() => {
		setRoleSocket('user')
		if(token && dataOrderContext?.status){
			console.log('INI GET ORDER DARI MERCHANT PAGE USEEFFECT [dataOrderContext]')
			console.log(dataOrderContext)
			setStatusOrder({
				id: dataOrderContext.status.id,
				message: messageStatus[dataOrderContext.status.id] || dataOrderContext?.status?.message
			})
			console.log('INI GET DATA ORDER')
			if(useSocket?.connected){
				useSocket?.emit('subscribeOrderUser', dataOrderContext.id_order)
			}else{
				useSocket?.once('connect', () => {
					useSocket?.emit('subscribeOrderUser', dataOrderContext.id_order)
				})
			}

			useSocket?.on('updateStatusOrder', (data) => {
				console.log('Order update: ', data)
				setStatusOrder(data?.status)
				// getDataOrder()
			})

			return () => {
				useSocket?.off('updateStatusOrder')
				useSocket?.off('connect')
			}
		}
	}, [dataOrderContext])



						// MODAL OPERATIONAL TIME
	const [isModalOperationalTimeOpen, setIsModalOperationalTimeOpen] = useState(false)
	const toggleModalOperationalTime = () => {
		setIsModalOperationalTimeOpen((x) => !x)
	}



						// MODAL DETAIL MENU
	const [isOpenModalDetailMenu, setIsOpenModalDetailMenu] = useState(false)
	const [dataDetailMenu, setDataDetailMenu] = useState({})
	const handleOpenModalDetailMenu = ({menu}) => {
		setIsOpenModalDetailMenu(true)
		setDataDetailMenu(menu)
		document.body.classList.add('no-scroll')
		console.log(menu)
	}

	const handleCloseModalDetailMenu = () => {
		setIsOpenModalDetailMenu(false)
		setDataDetailMenu({})
		document.body.classList.remove('no-scroll')
	}

	useEffect(() => {
		if(isModalOperationalTimeOpen){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}
	}, [isModalOperationalTimeOpen])



	// HADLE BUTTON DETAIL
	const handleDetail = () => {
		navigate('/progress')
	}





	return(
		<>
		<Helmet>
		<title>{currentMerchant?.name}</title>
		</Helmet>
		<AlertComponent isOpen={alert.isOpen} status={alert.status} message={alert.message} />

		<div className={merchantStyle.coverCurrentMerchant}>
		{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${id_merchant}/${currentMerchant?.image}`} alt="" />*/}
		<img src={CloudinaryOptimized(currentMerchant?.image)} alt="" />
		<div className={merchantStyle.infoCurrentMerchant}>
		<div className={merchantStyle.left}>
		<h1 className={merchantStyle.nameCurrentMerchant}>{currentMerchant?.name}</h1>
		<div className={merchantStyle.rating}>
		<div className={merchantStyle.star}>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="far fa-star"></i>
		</div>
		</div>
		</div>
		<div className={merchantStyle.right}>
		<div role='button' onClick={toggleModalOperationalTime} className={merchantStyle.top}>
		<div className={merchantStyle.text}>
		{currentMerchant?.is_open?.status ? (
			<>
			<span className={merchantStyle.open}>BUKA</span>
			<h2>Tutup pukul {currentMerchant?.is_open?.end_time}</h2>
			</>
			) : (
			<>
			<span className={merchantStyle.close}>TUTUP</span>
			{/*<h2>Buka pukul {currentMerchant?.is_open?.start_time}</h2>*/}
			</>
			)}
			</div>
			<div className={merchantStyle.icon}>
			<i className="fas fa-info-circle"></i>
			</div>
			</div>
			<div className={merchantStyle.bottom}>
			<div className={merchantStyle.shippingCost}>
			<span>Ongkir: Rp {Number(shippingCost).toLocaleString('id-ID')}</span>
			</div>
			</div>
			</div>
			</div>
			</div>

			<div className={merchantStyle.content} style={{paddingTop: '20px'}}>
			<div className={merchantStyle.searchBar2}>
								{/*<input type="text" name="" ref={searchInput} placeholder="Cari Di sini" />*/}
			<input type="text" name="" ref={searchInput} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Cari Di sini" />
								{/*<button type="button" className={merchantStyle.btnSearch} onClick={searchButton}>Cari</button>*/}
			<button type="button" className={merchantStyle.btnClear} onClick={clearButton} disabled={searchValue.trim() === ''}>Hapus</button>
			</div>
			<div className={merchantStyle.category}>
			<TabCategory />
			</div>
			<MenuByCategoryList menu_list={menuList} handleDetail={menu => handleOpenModalDetailMenu(menu)} />
			</div>

			{!dataOrderContext ? (
				<CheckoutComponent />
				) : (
				<>
				<div className={merchantStyle.statusBox}>
				<div className={merchantStyle.status}>
				<div className={merchantStyle.text}>
				<h2>{statusOrder.message}</h2>
				</div>
				<div className={merchantStyle.btnDetail}>
				<button className="btn-primary" onClick={handleDetail}>DETAIL</button>
				</div>
				</div>
				</div>
				</>
				)
			}

			<FooterComponent />

			{/* {isModalOperationalTimeOpen && ( */}
			<Suspense fallback={<div>Memuat . . .</div>}>
			<LazyTimeOperational idMerchant={id_merchant} isOpen={isModalOperationalTimeOpen} onClose={() => setIsModalOperationalTimeOpen(false)} />
			</Suspense>
				{/*)}*/}

			<ModalDetailMenu isOpen={isOpenModalDetailMenu} onClose={handleCloseModalDetailMenu} nameMerchant={currentMerchant?.name} data={dataDetailMenu} />
			</>
			)
}

export default MerchantPage