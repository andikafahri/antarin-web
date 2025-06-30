import {useState, useEffect, useMemo, useRef, useContext} from 'react'
import clsx from 'clsx'
import {Link, useSearchParams, useParams, useNavigate, useLocation, useNavigationType} from 'react-router-dom'
import debounce from 'lodash.debounce'
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

const MerchantPage = () => {
	const {setAlert} = useContext(AlertContext)
	const {id_merchant} = useParams()
	const [params] = useSearchParams()
	const searchParams = params.get('search')
	const categoryParams = params.get('category')

	// ALERT
	// const [isOpenAlert, setIsOpenAlert] = useState(true)
	// const [statusAlert, setStatusAlert] = useState('warning')
	
	// QUERY GENERATOR
	const navigate = useNavigate()
	const location = useLocation()
	const queryFilter = ({name, category}) => {
		const query = new URLSearchParams(location.search)

		// if(name !== null){
		if(name){
			query.set('search', name)
		}else{
			query.delete('search')	
		}
			// }

			// if(category !== null){
		if(category){
			query.set('category', category)
		}else{
			query.delete('category')	
		}
				// }

		navigate(`?${query.toString()}`, {replace: true})
	}



			// SEARCH
	const searchInput = useRef()
	const [searchValue, setSearchValue] = useState('')
			// const searchButton = () => {
				// 	queryFilter({name: searchInput.current.value})
				// }

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
		getTime()
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

	const MenuByCategoryList = () => {
		if(!menuList){
			return <div className={merchantStyle.loading}>Memuat . . .</div>
		}

		if(menuList.length === 0){
			return <div className={merchantStyle.loading}><div>Data Kosong</div></div>
		}

		return menuList?.map(category => {
			return (
				<div key={category.id}>
				<div className={merchantStyle.headerContent}>
				<h1 className={merchantStyle.title}>{category.name}</h1>
				</div>
				<div className={merchantStyle.cardsGroup}>
				{Object.values(category?.menus).map(menu => (
					<Card2Component key={menu.id} data={menu} role='button' onClick={() => handleOpenModalDetailMenu({menu})}/>
					))}
				</div>
				</div>
				)
		})
						// return <div className={merchantStyle.loading}>Memuat . . .</div>
	}







						// GET STATUS ORDER
	const [statusOrder, setStatusOrder] = useState({})
	const {getDataOrder, dataOrderContext} = useContext(OrderContext)
	const messageStatus = {
		1: 'Pesanan telah dibuat. Menunggu konfirmasi dari merchant',
		2: 'Pesanan diproses merchant',
		5: 'Kurir mengambil pesanan'
	}
	// const navigationType = useNavigationType()
	useEffect(() => {
		// setTimeout(() => getDataOrder(), 0)
		// getDataOrder()
		// console.log('INI GET ORDER DARI MERCHANT PAGE USEEFFECT []')
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



	// GET TIME OPERATIONAL
	const dataDay = [
		{'id': 1, 'name': 'Senin'},
		{'id': 2, 'name': 'Selasa'},
		{'id': 3, 'name': 'Rabu'},
		{'id': 4, 'name': 'Kamis'},
		{'id': 5, 'name': "Jum'at"},
		{'id': 6, 'name': 'Sabtu'},
		{'id': 7, 'name': 'Minggu'}
	]
	const [loadingTimeOperational, setLoadingTimeOperational] = useState(true)
	const [listTimeOperational, setListTimeOperational] = useState(null)
	const getTime = () => {
		setLoadingTimeOperational(true)
		getTimeOperational().then(result => {
			setListTimeOperational(result)
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}else{
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
			}
			return
		}).finally(() => {
			setLoadingTimeOperational(false)
		})
	}

	const TimeOperationalList = () => {
		// return listTimeOperational.map(time => {
		// 	return (
		// 		<span className={merchantStyle.active}>
		// 		<h3>{dataDay.find(day => day.id === time.day).name}</h3>
		// 		<h3>{time.start_time} - {time.end_time}</h3>
		// 		</span>
		// 		)
		// })

		return dataDay.map(time => {
			const day = listTimeOperational?.find(x => x.day === time.id)
			return (
				day ? (
					<span className={new Date().getDay() === time.id ? merchantStyle.active : ''}>
					<h3>{time.name}</h3>
					<h3>{day.start_time} - {day.end_time}</h3>
					</span>
					) : (
					<span className={new Date().getDay() === time.id ? merchantStyle.active : ''}>
					<h3>{time.name}</h3>
					<h3 style={{
						color: 'var(--danger-color)',
						fontWeight: 'bold',
						letterSpacing: '1px',
						fontSize: '.9rem',
						textAlign: 'center',
						width: '100%'
					}}>LIBUR</h3>
					</span>
					)
					)
		})
	}

	return(
		<>
		<AlertComponent isOpen={alert.isOpen} status={alert.status} message={alert.message} />

		<div className={merchantStyle.coverCurrentMerchant}>
		<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${id_merchant}/${currentMerchant?.image}`} alt="" />
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
		<div role='button' onClick={toggleModalOperationalTime}className={merchantStyle.top}>
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
			<MenuByCategoryList />
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

			<div role='button' className={clsx(merchantStyle.modal, isModalOperationalTimeOpen && merchantStyle.open)} onClick={(e) => {
				if(e.target === e.currentTarget){setIsModalOperationalTimeOpen(false)
			}
	}}>

	<div className={merchantStyle.modalOperationalTime}>
	<button className={merchantStyle.btnClose} onClick={() => setIsModalOperationalTimeOpen(false)}><i className="fas fa-close"></i></button>
	<h2>Jam Buka</h2>
	<div className={merchantStyle.containerListTime}>
	<div className={merchantStyle.listTime}>

	{/*<span>
	<h3>Senin</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span className={merchantStyle.active}>
	<h3>Selasa</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span>
	<h3>Rabu</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span>
	<h3>Kamis</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span>
	<h3>Jum'at</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span>
	<h3>Sabtu</h3>
	<h3>08.00 - 21.00</h3>
	</span>
	<span>
	<h3>Minggu</h3>
	<h3>08.00 - 21.00</h3>
	</span>*/}
	<TimeOperationalList />

	</div>
	</div>
	</div>
	</div>

	<ModalDetailMenu isOpen={isOpenModalDetailMenu} onClose={handleCloseModalDetailMenu} nameMerchant={currentMerchant?.name} data={dataDetailMenu} />
	</>
	)
}

export default MerchantPage