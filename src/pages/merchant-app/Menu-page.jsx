import {useState, useEffect, useContext, useMemo} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import debounce from 'lodash.debounce'
import clsx from 'clsx'
import {jwtDecode} from 'jwt-decode'
import {Helmet} from 'react-helmet'
import {AlertContext} from '../../context/Alert-context.jsx'
import {getCategory, getMenu} from '../../api-merchant-app.jsx'
import AddMenuModal from '../../modal/merchant-app/Add-menu-modal.jsx'
import EditMenuModal from '../../modal/merchant-app/Edit-menu-modal.jsx'
import s from '../../styles/pages/merchant-app/Menu.module.css'

const MenuPage = () => {
	const {setAlert} = useContext(AlertContext)
	const navigate = useNavigate()
	const location = useLocation()
	const idMerchant = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).id || null : null
	const [filter, setFilter] = useState({search: null, category: null})
	const [searchValue, setSearchValue] = useState('')
	// const [categoryValue, setCategoryValue] = useState(null)
	const [menu, setMenu] = useState([])

	useEffect(() => {
		getDataCategory()
		getDataMenu()
	}, [])

	const delaySearch = useMemo(() => 
		debounce(val => {
			setFilter({search: val, category: filter.category})
		}, 500), [searchValue])

	useEffect(() => {
		delaySearch(searchValue)
		return () => delaySearch.cancel()
	}, [searchValue])

	const filterQuery = useMemo(() => ({
		search: searchValue,
		category: filter.category
	}), [searchValue, filter.category])

	useEffect(() => {
		getDataMenu(filter)
	}, [filter])

	// GET CATEGORY
	const [loadingCategory, setLoadingCategory] = useState(false)
	const [category, setCategory] = useState([])
	const getDataCategory = () => {
		setLoadingCategory(true)
		getCategory().then(result => {
			setCategory(result)
		}).catch(error => {
			console.log(error)
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
				return
			}

			if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}

			if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}
		}).finally(() => {
			setLoadingCategory(false)
		})
	}

	const TabCategory = () => {
		return category.map((item, i) => {
			return (
				<span role='button' className={filter.category === item.id ? s.active : ''} onClick={() => setFilter({search: searchValue, category: item.id})} key={i}>{item.name}</span>
				)
		})
	}

	// GET LIST MENU
	const [loadingListMenu, setLoadingListMenu] = useState(false)
	const getDataMenu = (filter) => {
		setLoadingListMenu(true)
		getMenu(filter).then(result => {
			// const data = [{category: {id, name}, menus: []}]
			const groupByCategory = {}
			result?.map((menu) => {
				const idCategory = menu.category.id

				if(!groupByCategory[idCategory]){
					groupByCategory[idCategory] = {
						id: idCategory,
						name: menu.category.name,
						menus: []
					}
				}

				const {category, ...menuWithoutCategory} = menu
				groupByCategory[idCategory].menus.push(menuWithoutCategory)
			})

			setMenu(Object.values(groupByCategory))

		}).catch(error => {
			console.log(error)
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
				return
			}

			if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}

			if(error.status === 400 || error.status === 402 || error.status === 403){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}
		}).finally(() => {
			setLoadingListMenu(false)
		})
	}

	const List = () => {
		if(loadingListMenu){
			return 'Memuat . . .'
		}

		if(menu.length === 0){
			return 'Kosong'
		}

		return menu?.map((item, i) => {
			return (
				<div className={s.group} key={i}>
				<h1>{item.name}</h1>
				<div className={s.body}>
				{item.menus.map((menu, j) => {
					return (
						<div role='button' className={clsx(s.card, 'notHighlight')} key={j} onClick={() => handleModalEditMenu(menu, item)}>
						{menu.is_ready ? (<span className={s.ready}>Tersedia</span>) : (<span className={s.notReady}>Tidak Tersedia</span>)}
						<div className={s.picture}>
						{/*<img src={`${import.meta.env.VITE_BASEURL}/img/merchant/${idMerchant}/${menu.image}`} alt="" 
						/>*/}
						<img src={menu.image} alt="" />
						</div>
						<div className={s.info}>
						<h2>{menu.name}</h2>
						<h3>{Number(menu.price).toLocaleString('id-ID')}</h3>
						</div>
						</div>
						)
				})}
				</div>
				</div>
				)
		})
	}

	const [isOpenModalAddMenu, setIsOpenModalAddMenu] = useState(false)
	const handleModalAddMenu = () => {
		setIsOpenModalAddMenu(x => !x)
		if(!isOpenModalAddMenu){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}
	}

	const saved = () => {
		getDataMenu()
		handleModalAddMenu()
	}

	const [isOpenModalEditMenu, setIsOpenModalEditMenu] = useState(false)
	const [dataEdit, setDataEdit] = useState({})
	const handleModalEditMenu = (menu, category) => {
		setIsOpenModalEditMenu(x => !x)
		if(!isOpenModalEditMenu){
			document.body.classList.add('no-scroll')
			// const {image, ...data} = menu
			// data.image = `${import.meta.env.VITE_BASEURL}/img/merchant/${idMerchant}/${menu.image}`
			menu.category = category
			setDataEdit(menu)
		}else{
			document.body.classList.remove('no-scroll')
		}
	}

	const updated = () => {
		getDataMenu()
		handleModalEditMenu()
	}

	return (
		<>
		<Helmet>
		<title>Kelola Menu | Merchant</title>
		</Helmet>
		<div className={s.container}>
		<h1>Kelola Menu</h1>
		<div className={s.header}>
		<div className={s.searchInput}>
		<input type="text" value={searchValue} placeholder="Cari Menu" onChange={e => setSearchValue(e.target.value)} />
		{searchValue ? (<span role='button' onClick={() => setSearchValue('')}><i className='fas fa-close'></i></span>) : ''}
		</div>
		<div className={s.category}>
		<span role='button' className={!filter.category ? s.active : ''} onClick={() => setFilter({search: searchValue, category: null})}>Semua</span>
		<TabCategory />
		</div>
		</div>
		<List />
		<button className={clsx(s.btnAdd, 'btn-primary')} onClick={handleModalAddMenu}><i className='fas fa-plus'></i> TAMBAH</button>
		</div>

		<AddMenuModal isOpen={isOpenModalAddMenu} onClose={handleModalAddMenu} saved={saved} />

		<EditMenuModal isOpen={isOpenModalEditMenu} data={dataEdit} onClose={handleModalEditMenu} updated={updated} />
		</>
		)
}

export default MenuPage