import {useState, useEffect, useRef, useContext} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {AlertContext} from '../../context/Alert-context.jsx'
import {getCategory} from '../../api-public.jsx'
import {reqAddMenu} from '../../api-merchant-app.jsx'
import SelectComponent from '../../components/Select-component.jsx'
import s from '../../styles/modal/merchant-app/Edit-menu-modal.module.css'
import sa from '../../styles/modal/merchant-app/Add-menu-modal.module.css'

const AddMenuModal = ({isOpen, onClose, saved}) => {
	const {setAlert} = useContext(AlertContext)
	const navigate = useNavigate()
	const location = useLocation()
	const inputFileRef = useRef('')
	const [imageValue, setImageValue] = useState(null)
	const [imageReview, setImageReview] = useState(null)
	const [request, setRequest] = useState({})

	useEffect(() => {
		setImageValue(null)
		inputFileRef.current.value = ''
		setImageReview(null)
		setRequest({})
		setRequest({is_ready: true})
		setVariant([])
	}, [isOpen])

	const handleAddImage = (e) => {
		const file = e.target.files[0]

		if(file.type.startsWith('image/')){
			setImageValue(file)
			setImageReview(URL.createObjectURL(file))
		}else{
			setImageValue(null)
			setImageReview(null)
		}
	}

	useEffect(() => {
		getDataCategory()
	}, [])

	const [dataCategory, setDataCategory] = useState([])
	const [loadingCategory, setLoadingCategory] = useState(false)
	const getDataCategory = () => {
		setLoadingCategory(true)
		getCategory().then(result => {
			setDataCategory(result)
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
				return
			}

			if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}

			setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			console.log(error)
		}).finally(() => {
			setLoadingCategory(false)
		})
	}

	const [isOpenCategoryDropdown, setIsOpenCategoryDropdown] = useState(false)
	const handleCategoryDropdown = () => {
		setIsOpenCategoryDropdown(x => !x)
	}

	const [isOpenPopUpAddVariant, setIsOpenPopUpAddVariant] = useState(false)
	const [isOpenPopUpEditVariant, setIsOpenPopUpEditVariant] = useState(false)
	const [isOpenPopUpEditVariantItem, setIsOpenPopUpEditVariantItem] = useState(false)
	const inputRef = useRef([])

	const [variant, setVariant] = useState([])
	const [variantValue, setVariantValue] = useState('')
	const handleAddVariant = () => {
		setIsOpenPopUpAddVariant(true)
		inputRef.current[0].focus()
	}

	const saveVariant = () => {
		setVariant(prev => [...prev, {name: variantValue, items: []}])
		handleClosePopUp()
	}

	const ShowVariantList = () => {
		return (
			<>
			{variant.map((v, iv) => (
				<div className={s.multipleInputContainer} key={iv}>
				<div className={s.title}>
				<label>{v.name}</label>
				<span role='button' onClick={() => handleEditVariant(iv)}><i className='fas fa-pencil'></i></span>
				</div>
				<div className={s.multipleInput}>
				{variant[iv].items?.map((item, i) => (
					<div role='button' className={clsx(s.card, item.is_ready === true && s.ready)} onClick={() => handleEditVariantItem(iv, i)} key={i}>
					<h2>{item.name}</h2>
					<h3>{item.price}</h3>
					</div>
					))}
				{/*<i role='button' className='fas fa-circle-plus' onClick={() => handleAddVariantItem(i)}></i>*/}
				<button onClick={() => handleAddVariantItem(iv)}><i className='fas fa-plus'></i> Tambah item</button>
				</div>
				</div>
				))}
			</>
			)
	}

	const [isOpenPopUpAddVariantItem, setIsOpenPopUpAddVariantItem] = useState(false)
	const [indexVariant, setIndexVariant] = useState(null)
	const [variantItemValue, setVariantItemValue] = useState({name: '', price: 0, is_ready: null})
	const handleAddVariantItem = (index) => {
		setIndexVariant(index)
		setVariantItemValue({is_ready: true})
		inputRef.current[1].focus()
		setIsOpenPopUpAddVariantItem(true)
	}

	const saveVariantItem = (index) => {
		setVariant(prev => prev.map((v, i) => {
			if(i === index){
				return {...v, items: [...v.items, {name: variantItemValue.name, price: variantItemValue.price ? variantItemValue.price : 0, is_ready: variantItemValue.is_ready ?? true}]}
			}
			return v
		}))
		handleClosePopUp()
	}
	console.log(variantItemValue)



	// EDIT
	const [editVariantValue, setEditVariantValue] = useState('')
	const handleEditVariant = (index) => {
		setIndexVariant(index)
		setEditVariantValue(variant[index].name)
		inputRef.current[2].focus()
		setIsOpenPopUpEditVariant(true)
	}

	const editVariant = (index) => {
		setVariant(v => v.map((v, i) => {
			if(i === index){
				return {...v, name: editVariantValue}
			}
			return v
		}))
		handleClosePopUp()
	}

	const deleteVariant = (index) => {
		setVariant(prev => prev.filter((_, i) => i !== index))
		handleClosePopUp()
	}

	const [editVariantItemValue, setEditVariantItemValue] = useState({name: '', price: 0, is_ready: null})
	const [indexVariantItem, setIndexVariantItem] = useState(null)
	const handleEditVariantItem = (indexVariant, indexItem) => {
		setIndexVariant(indexVariant)
		setIndexVariantItem(indexItem)
		setEditVariantItemValue({name: variant[indexVariant].items[indexItem].name, price: variant[indexVariant].items[indexItem].price, is_ready: variant[indexVariant].items[indexItem].is_ready})
		inputRef.current[3].focus()
		setIsOpenPopUpEditVariantItem(true)
	}

	const editVariantItem = (indexVariant, indexItem) => {
		setVariant(prev => prev.map((v, i) => {
			if(i === indexVariant){
				const updateItem = v.items.map((item, i) => {
					if(i === indexItem){
						return {...item, name: editVariantItemValue.name, price: editVariantItemValue.price ? editVariantItemValue.price : 0, is_ready: editVariantItemValue.is_ready}
					}
					return item
				})
				return {...v, items: updateItem}
			}
			return v
		}))
		handleClosePopUp()
	}

	const deleteVariantItem = (indexVariant, indexVariantItem) => {
		setVariant(prev => prev.map((v, i) => {
			if(i === indexVariant){
				return {...v, items: v.items.filter((_, j) => j !== indexVariantItem)}
			}
			return v
		}))

		// ATAU

		// setVariant(prev => {
		// 	const data = [...prev]
		// 	data[indexVariant] = {...data[indexVariant], item: data[indexVariant].item.filter((_,i) => i !== indexVariantItem)}
		// 	return data
		// })
		handleClosePopUp()
	}

	const handleClosePopUp = () => {
		setIsOpenPopUpAddVariant(false)
		setIsOpenPopUpAddVariantItem(false)
		setIsOpenPopUpEditVariant(false)
		setIsOpenPopUpEditVariantItem(false)
		setIndexVariant(null)
		setIndexVariantItem(null)
		setVariantValue('')
		setVariantItemValue({name: '', price: 0, is_ready: null})
		setEditVariantValue('')
		setEditVariantItemValue({name: '', price: 0, is_ready: null})
	}

	const [loadingSave, setLoadingSave] = useState(false)
	const handleSaveMenu = () => {
		const {category, is_ready, ...payload} = request
		payload.id_category = category?.id
		// payload.variants = variant

		const formData = new FormData()

		if(imageValue){
			formData.append('file', imageValue)
		}else{
			setAlert({isOpen: true, status: 'warning', message: 'Gambar tidak boleh kosong'})
			return
		}

		if(variant.length > 1){
			setAlert({isOpen: true, status: 'warning', message: 'Kamu hanya boleh menambahkan 1 kategori varian'})
			return
		}


		Object.entries(payload).forEach(([key, value]) => {
			formData.append(key, value)
		})
		console.log(variant)
		// variant.forEach(v => formData.append('variants', JSON.stringify([v])))

		let isReady = request.is_ready

		if(variant?.length !== 0){
			if(!variant[0].items.some(v => !!v.is_ready)){
				isReady = false
			}

			formData.append('variants', JSON.stringify(variant))
		}

		formData.append('is_ready', isReady)

		console.log([...formData.entries()])
		setLoadingSave(true)
		reqAddMenu(formData).then(result => {
			console.log(result)
			setAlert({isOpen: true, status: 'success', message: result})
			saved()
		}).catch(error => {
			console.log(error)
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
				return
			}

			if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}

			setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
		}).finally(() => {
			setLoadingSave(false)
		})
	}

	return (
		<>
		<div role='button' className={clsx(s.modal, isOpen && s.open)} onClick={e => e.target === e.currentTarget && onClose()}>
		<div className={s.box}>
		<h1 className={s.title}>Tambah Menu</h1>
		<span role='button' className='notHighlight' onClick={onClose}><i className='fas fa-close'></i></span>
		<div className={s.body}>
		<div className={s.left}>
		<div className={s.picture}>
		<img src={imageReview || '/img/no-image.jpg'} alt="" />
		</div>
		<label className={clsx(sa.btnUpload, 'notHighlight')}>
		<input type="file" ref={inputFileRef} onChange={handleAddImage}/>
		Unggah Gambar
		</label>
		<span>Ketersediaan Menu</span>
		<input type="checkbox" id='isReady' className={sa.isReady} checked={request?.is_ready ?? true} onChange={e => setRequest({...request, is_ready: e.target.checked})} />
		<label className={clsx(sa.isReady, 'notHighlight')} htmlFor='isReady'></label>
		</div>
		<div className={s.middle}>
		<div className={s.inputGroup}>
		<label>Nama<i className='required'> *</i></label>
		<input type="text" value={request?.name ?? ''} placeholder="Cth: Nasi Goreng" onChange={e => setRequest({...request, name: e.target.value})} />
		</div>
		<div className={s.inputGroup}>
		<label>Detail</label>
		<textarea rows='4' value={request?.detail ?? ''} placeholder="Cth: Nasi goreng dengan isian ayam suwir, telur orak-arik, dan sosis." onChange={e => setRequest({...request, detail: e.target.value})} />
		</div>
		<div className={s.inputGroup}>
		<label>Kategori<i className='required'> *</i></label>
		<SelectComponent styling={{height: '30px'}} stylingValue={{fontSize: '1rem'}} defaultValue={'Pilih Kategori'} handle={handleCategoryDropdown} isOpen={isOpenCategoryDropdown} isLoading={loadingCategory} data={dataCategory} selected={request?.category ?? ''} onSelect={newCategory => setRequest({...request, category: newCategory})} />
		</div>
		<div className={s.inputGroup}>
		<label>Harga<i className='required'> *</i></label>
		<input type="number" value={request?.price ?? ''} style={{textAlign: 'right'}} placeholder="Cth: 10000" onChange={e => setRequest({...request, price: e.target.value})} />
		</div>
		</div>
		<div className={s.right}>
		<h2 className={s.title}>Varian <i role='button' className='fas fa-circle-plus' onClick={handleAddVariant}></i></h2>
		<ShowVariantList />
		{/*<div className={s.multipleInputContainer}>
		<div className={s.title}>
		<label>Level</label>
		<span role='button' onClick={handleEditVariant}><i className='fas fa-pencil'></i></span>
		</div>
		<div className={s.multipleInput}>
		<div className={s.card}>
		<h2>Level 1</h2>
		<h3>0</h3>	
		</div>
		<div className={s.card}>
		<h2>Level 2</h2>
		<h3>0</h3>	
		</div>
		<div className={s.card}>
		<h2>Level 3</h2>
		<h3>1.000</h3>	
		</div>
		</div>
		</div>*/}
		</div>
		</div>
		<div className={s.footer}>
		<button className='btn-second' onClick={onClose} disabled={loadingSave}>BATAL</button>
		<button className='btn-primary' onClick={handleSaveMenu} disabled={loadingSave}>SIMPAN</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(s.popUpContainer, isOpenPopUpAddVariant && s.open)} onClick={(e) => {if(e.target === e.currentTarget){handleClosePopUp()}}}>
		<div className={s.popUp}>
		<label className={s.title}>Tambah Varian</label>
		<span role='button' onClick={handleClosePopUp}>
		<i className='fas fa-close'></i>
		</span>
		<label>Nama Varian<i className='required'> *</i></label>
		<input type="text" ref={e => inputRef.current[0] = e} value={variantValue ?? ''} placeholder='Cth: Tingkat Kepedasan' onChange={(e) => setVariantValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveVariant()} />
		<div className={s.btnGroup}>
		<button className={'btn-second'} onClick={handleClosePopUp}>BATAL</button>
		<button className={'btn-primary'} onClick={saveVariant}>TAMBAH</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(s.popUpContainer, isOpenPopUpAddVariantItem && s.open)} onClick={(e) => {if(e.target === e.currentTarget){handleClosePopUp()}}}>
		<div className={s.popUp}>
		<label className={s.title}>Tambah Item</label>
		<span role='button' onClick={handleClosePopUp}>
		<i className='fas fa-close'></i>
		</span>
		<label>Nama Item<i className='required'> *</i></label>
		<input type="text" ref={e => inputRef.current[1] = e} value={variantItemValue?.name} placeholder='Cth: Level 1' onChange={(e) => setVariantItemValue({...variantItemValue, name: e.target.value})} onKeyDown={e => e.key === 'Enter' && saveVariantItem(indexVariant)} />
		<label>Harga Tambahan</label>
		<input type="number" style={{textAlign: 'right'}} value={variantItemValue?.price} placeholder='Cth: 1000' onChange={(e) => setVariantItemValue({...variantItemValue, price: e.target.value})} onKeyDown={e => e.key === 'Enter' && saveVariantItem(indexVariant)} />
		<label>Ketersediaan Item Varian<i className='required'> *</i></label>
		<input type="checkbox" id='isReadyVariantItem' className={sa.isReady} checked={variantItemValue?.is_ready} onChange={e => setVariantItemValue({...variantItemValue, is_ready: e.target.checked})} />
		<label className={clsx(sa.isReady, 'notHighlight')} style={{alignSelf: 'center', transform: 'scale(.9)'}} htmlFor='isReadyVariantItem'></label>
		<div className={s.btnGroup}>
		<button className={'btn-second'} onClick={handleClosePopUp}>BATAL</button>
		<button className={'btn-primary'} onClick={() => saveVariantItem(indexVariant)}>TAMBAH</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(s.popUpContainer, isOpenPopUpEditVariant && s.open)} onClick={(e) => {if(e.target === e.currentTarget){handleClosePopUp()}}}>
		<div className={s.popUp}>
		<label className={s.title}>Edit Varian</label>
		<span role='button' onClick={handleClosePopUp}>
		<i className='fas fa-close'></i>
		</span>
		<label>Nama Varian<i className='required'> *</i></label>
		<input type="text" ref={e => inputRef.current[2] = e} value={editVariantValue} placeholder='Cth: Tingkat Kepedasan' onChange={e => setEditVariantValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && editVariant(indexVariant)} />
		<div className={s.btnGroup}>
		<button className={'btn-danger'} onClick={() => deleteVariant(indexVariant)}>HAPUS</button>
		<button className={'btn-primary'} onClick={() => editVariant(indexVariant)}>SIMPAN</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(s.popUpContainer, isOpenPopUpEditVariantItem && s.open)} onClick={(e) => {if(e.target === e.currentTarget){handleClosePopUp()}}}>
		<div className={s.popUp}>
		<label className={s.title}>Edit Item</label>
		<span role='button' onClick={handleClosePopUp}>
		<i className='fas fa-close'></i>
		</span>
		<label>Nama Item<i className='required'> *</i></label>
		<input type="text" ref={e => inputRef.current[3] = e} value={editVariantItemValue.name ?? ''} placeholder='Cth: Level 1' onChange={(e) => setEditVariantItemValue({...editVariantItemValue, name: e.target.value})} onKeyDown={(e) => {if(e.key === 'Enter'){editVariantItem(indexVariant, indexVariantItem)}}} />
		<label>Harga Tambahan</label>
		<input type="number" style={{textAlign: 'right'}} value={editVariantItemValue.price ?? 0} placeholder='Cth: 1000' onChange={(e) => setEditVariantItemValue({...editVariantItemValue, price: e.target.value})} onKeyDown={e => e.key === 'Enter' && editVariantItem(indexVariant, indexVariantItem)} />
		<label>Ketersediaan Item Varian<i className='required'> *</i></label>
		<input type="checkbox" id='isReadyVariantItemUpdate' className={sa.isReady} checked={editVariantItemValue?.is_ready ?? true} onChange={e => setEditVariantItemValue({...editVariantItemValue, is_ready: e.target.checked})} />
		<label className={clsx(sa.isReady, 'notHighlight')} style={{alignSelf: 'center', transform: 'scale(.9)'}} htmlFor='isReadyVariantItemUpdate'></label>
		<div className={s.btnGroup}>
		<button className={'btn-danger'} onClick={() => deleteVariantItem(indexVariant, indexVariantItem)}>HAPUS</button>
		<button className={'btn-primary'} onClick={() => editVariantItem(indexVariant, indexVariantItem)}>SIMPAN</button>
		</div>
		</div>
		</div>
		</>
		)
}

export default AddMenuModal