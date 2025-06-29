import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {AlertContext} from '../../context/Alert-context.jsx'
import {getProvince, getCity, getSubdistrict} from '../../api-public.jsx'
import {reqRegister} from '../../api-merchant-app.jsx'
import s from '../../styles/pages/merchant-app/Register.module.css'
import SelectWithSearchComponent from '../../components/Select-with-search-component.jsx'

const RegisterPage = () => {
	const {setAlert} = useContext(AlertContext)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()
	const [request, setRequest] = useState({})

	useEffect(() => {
		console.log('REGISTER PAGE')
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

	

	// HANDLE REGISTER
	const [loadingBtnRegister, setLoadingBtnRegister] = useState(false)
	const handleRegister = () => {
		const {subd, city, prov, ...req} = request
		req.id_subd = request.subd.id
		req.id_city = request.city.id
		req.id_prov = request.prov.id
		console.log(req)

		setLoadingBtnRegister(true)
		reqRegister(req).then(result => {
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
		<div className={s.box}>
		<label>REGISTER</label>
		<div className={s.logo}>
		<img src="/img/Logo Antarin.png" alt="" />
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
		<label>Provinsi<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingProv} handle={handleOpenSelectProvince} isOpen={isOpenSelectProvince} data={province} netral={'Pilih Provinsi'} onSelect={(newProv) => setRequest({...request, prov: newProv, city: null})} selected={request?.prov} />
		</div>
		<div className={s.input}>
		<label>Kabupaten<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingCity} handle={handleOpenSelectCity} isOpen={isOpenSelectCity} data={city} netral={'Pilih Kota/Kabupaten'} onSelect={(newCity) => setRequest({...request, city: newCity, subd: null})} selected={request?.city} />
		</div>
		<div className={s.input}>
		<label>Kecamatan<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingSubd} handle={handleOpenSelectSubdistrict} isOpen={isOpenSelectSubdistrict} data={subdistrict} netral={'Pilih Kecamatan'} onSelect={(newSubdistrict) => setRequest({...request, subd: newSubdistrict})} selected={request?.subd} />
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
		</>
		)
}

export default RegisterPage