import {useState, useEffect, useContext, useRef} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {Helmet} from 'react-helmet'
import {AlertContext} from '../../context/Alert-context.jsx'
import MapComponent from '../../components/merchant-app/Map-component.jsx'
import {getProvince, getCity, getSubdistrict} from '../../api-public.jsx'
import {reqRegister} from '../../api-merchant-app.jsx'
import s from '../../styles/pages/merchant-app/Register.module.css'
import SelectWithSearchComponent from '../../components/Select-with-search-component.jsx'

const RegisterPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {setAlert} = useContext(AlertContext)
	const inputFileRef = useRef('')
	const [loading, setLoading] = useState(true)
	const [request, setRequest] = useState({})

	useEffect(() => {
		console.log('REGISTER PAGE')
		inputFileRef.current.value = ''
		getDataProvince(0)
		getDataCity(0)
		getDataSubdistrict(0)
	}, [])

	// GET DATA PROVINCE
	const [loadingProv, setLoadingProv] = useState(true)
	const [province, setProvince] = useState()
	const getDataProvince = () => {
		setLoadingProv(true)
		getProvince().then(result => {
			setProvince(result)
		}).catch(error => {
			setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
		}).finally(() => {
			setLoadingProv(false)
		})
	}

	// HANDLE OPEN SELECT PROVINCE
	const [isOpenSelectProvince, setIsOpenSelectProvince] = useState(false)
	const handleOpenSelectProvince = () => {
		setIsOpenSelectProvince(x => !x)
		setIsOpenSelectCity(false)
		setIsOpenSelectSubdistrict(false)
	}

	// GET DATA CITY
	useEffect(() => {
		console.log('ID PROV: '+request?.prov?.id)
		if(request?.prov?.id){
			getDataCity(request.prov.id)
			console.log('GET DATA CITY')
		}
	}, [request?.prov?.id])

	const [loadingCity, setLoadingCity] = useState(true)
	const [city, setCity] = useState()
	const getDataCity = (id_province) => {
		setLoadingCity(true)
		getCity(id_province).then(result => {
			setCity(result)
		}).catch(error => {
			setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
		}).finally(() => {
			setLoadingCity(false)
		})
	}

	// HANDLE OPEN SELECT CITY
	const [isOpenSelectCity, setIsOpenSelectCity] = useState(false)
	const handleOpenSelectCity = () => {
		setIsOpenSelectCity(x => !x)
		setIsOpenSelectProvince(false)
		setIsOpenSelectSubdistrict(false)
	}

	// GET DATA SUBDISTRICT
	useEffect(() => {
		console.log('ID CITY: '+request?.city?.id)
		if(request?.city?.id){
			getDataSubdistrict(request.city.id)
			console.log('GET DATA SUBDISTRICT')
		}
		console.log('SELECTED: '+request?.subd?.name)
	}, [request?.city?.id])
	
	const [loadingSubd, setLoadingSubd] = useState(true)
	const [subdistrict, setSubdistrict] = useState()
	const getDataSubdistrict = (id_city) => {
		setLoadingSubd(true)
		getSubdistrict(id_city).then(result => {
			setSubdistrict(result)
		}).catch(error => {
			setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
		}).finally(() => {
			setLoadingSubd(false)
		})
	}

	// HANDLE OPEN SELECT SUBDISTRICT
	const [isOpenSelectSubdistrict, setIsOpenSelectSubdistrict] = useState(false)
	const handleOpenSelectSubdistrict = () => {
		setIsOpenSelectSubdistrict(x => !x)
		setIsOpenSelectProvince(false)
		setIsOpenSelectCity(false)
	}

	

	const [imageValue, setImageValue] = useState(null)
	const [imageReview, setImageReview] = useState(null)
	const handleUploadImage = (e) => {
		const file = e.target.files[0]
		if(file?.type.startsWith('image/')){
			setImageValue(file)
			setImageReview(URL.createObjectURL(file))
		}else{
			setImageValue(null)
			setImageReview(null)
		}
	}
	console.log(imageValue)

	const [isOpenMap, setIsOpenMap] = useState(false)
	const handleMap = () => {
		setIsOpenMap(x => !x)
		if(!isOpenMap){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}
	}

	// HANDLE REGISTER
	const [loadingBtnRegister, setLoadingBtnRegister] = useState(false)
	const handleRegister = () => {
		const {subd, city, prov, cityNameView, provNameView, coordinates, ...req} = request
		const formData = new FormData()

		formData.append('role', 'merchant')
		formData.append('file', imageValue)
		formData.append('coordinates', JSON.stringify(coordinates))

		if(!phone){
			req.phone = ''
		}

		Object.entries(req).forEach(([key, value]) => {
			formData.append(key, value)
		})

		setLoadingBtnRegister(true)
		reqRegister(formData).then(result => {
			setAlert({isOpen: true, status: 'success', message: result})
			navigate('/merchant/login', {replace: true})
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
			}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}else{
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
			}
			return
		}).finally(() => {
			setLoadingBtnRegister(false)
		})
	}

	return (
		<>
		<Helmet>
		<title>Register | Antarin Merchant</title>
		</Helmet>
		<div className={s.box}>
		<label>REGISTER</label>
		<div className={s.logo}>
		<img src="/img/Logo Merchant.png" alt="" />
		</div>
		<div className={s.profile}>
		<div className={s.profilePicture}>
		<img src={imageReview || '/public/img/no-image.jpg'} alt="" />
		</div>
		{/*<button className={clsx(s.btnUpload, 'btn-primary')}><input type="file" />Unggah Gambar</button>*/}
		<label className={clsx(s.btnUpload, 'btn-primary')}>
		<input type="file" ref={inputFileRef} onChange={handleUploadImage}/>
		Unggah Gambar
		</label>
		</div>
		<div className={s.body}>
		<div className={s.left}>
		<div className={s.inputGroup}>
		<div className={s.input}>
		<label>Nama<i className='required'> *</i></label>
		<input type="text" value={request?.name} onChange={(e) => setRequest({...request, name: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Username<i className='required'> *</i></label>
		<input type="username" value={request?.username} autoCapitalize='off' onChange={(e) => setRequest({...request, username: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Password<i className='required'> *</i></label>
		<input type="text" value={request?.password} autoCapitalize='off' onChange={(e) => setRequest({...request, password: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Konfirmasi Password<i className='required'> *</i></label>
		<input type="text" value={request?.confirm_password} autoCapitalize='off' onChange={(e) => setRequest({...request, confirm_password: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Email<i className='required'> *</i></label>
		<input type="email" value={request?.email} autoCapitalize='off' onChange={(e) => setRequest({...request, email: e.target.value})} />
		</div>
		</div>
		</div>
		<div className={s.right}>
		<div className={s.inputGroup}>
		<div className={s.input}>
		<label>No WhatsApp</label>
		<input type="number" value={request?.phone ?? ''} onChange={(e) => setRequest({...request, phone: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Titik Lokasi<i className='required'> *</i></label>
		{
			request?.coordinates?.lng ? (
				<div className={s.detailLocation}>
				<label>Titik koordinat :</label>
				<span>{`${request?.coordinates?.lng}, ${request?.coordinates?.lat}`}</span>
				<label>Kabupaten/Kota :</label>
				<span>{request?.cityNameView ?? request?.city?.name}</span>
				<label>Provinsi :</label>
				<span>{request?.provNameView ?? request?.prov?.name}</span>
				</div>
				) : ''
		}
		<button className='btn-second' onClick={handleMap}>Buka Peta</button>
		</div>
		<div className={s.input}>
		<label>Detail Alamat<i className='required'> *</i></label>
		{/*<input type="text" value={request?.address} onChange={(e) => setRequest({...request, address: e.target.value})} />*/}
		<textarea rows='3' value={request?.address} onChange={(e) => setRequest({...request, address: e.target.value})} />
		</div>
		</div>
		</div>
		</div>
		<div className={s.buttonGroup}>
		<button className='btn-primary' onClick={handleRegister} disabled={loadingBtnRegister}>REGISTER</button>
		</div>
		</div>

		<MapComponent isOpen={isOpenMap} onClose={handleMap} data={request} newData={val => setRequest(prev => ({...prev, ...val}))} />
		</>
		)
}

export default RegisterPage