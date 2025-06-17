import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {AlertContext} from '../../context/Alert-context.jsx'
import {getProvince, getCity, getSubdistrict} from '../../api-public.jsx'
import {getProfile, reqUpdateProfile} from '../../api-merchant-app.jsx'
import s from '../../styles/pages/merchant-app/Profile.module.css'
import SelectWithSearchComponent from '../../components/Select-with-search-component.jsx'

const ProfilePage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [dataProfile, setDataProfile] = useState(null)

	const [loading, setLoading] = useState(true)
	useEffect(() => {
		console.log('PROFILE PAGE')
		getDataProfile()
		getDataProvince()
		// getDataCity(dataProfile?.prov?.id)
	// console.log('SELECTED: '+dataProfile?.prov?.name)
	}, [])

	// GET DATA PROFILE
	const getDataProfile = () => {
		setLoading(true)
		getProfile().then(result => {
			console.log(result)
			setDataProfile(result)
		}).catch(error => {
			console.log(error)
			if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}
		}).finally(() => {
			setLoading(false)
		})
	}

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
		console.log('ID PROV: '+dataProfile?.prov?.id)
		if(dataProfile?.prov?.id){
			getDataCity(dataProfile.prov.id)
			console.log('GET DATA CITY')
		}
	}, [dataProfile?.prov?.id])

	const [loadingCity, setLoadingCity] = useState(true)
	const [city, setCity] = useState()
	// const [selectedCity, setSelectedCity] = useState()
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

	// useEffect(() => {
	// 	if(city && dataProfile){
	// 		const found = city?.find(item => item.id === dataProfile?.city?.id)
	// 		if(!found){
	// 			setSelectedCity(null)
	// 		}
	// 	}
	// }, [city])

	// HANDLE OPEN SELECT CITY
	const [isOpenSelectCity, setIsOpenSelectCity] = useState(false)
	const handleOpenSelectCity = () => {
		setIsOpenSelectCity(x => !x)
		setIsOpenSelectProvince(false)
		setIsOpenSelectSubdistrict(false)
	}

	// GET DATA SUBDISTRICT
	useEffect(() => {
		console.log('ID CITY: '+dataProfile?.city?.id)
		if(dataProfile?.city?.id){
			getDataSubdistrict(dataProfile.city.id)
			console.log('GET DATA SUBDISTRICT')
		}
		console.log('SELECTED: '+dataProfile?.subd?.name)
	}, [dataProfile?.city?.id])
	
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

	const {setAlert} = useContext(AlertContext)
	const [loadingSave, setLoadingSave] = useState(false)
	const btnSave = () => {
		// console.log(dataProfile)
		// dataProfile.id_prov = dataProfile?.prov?.id
		// dataProfile.id_city = dataProfile?.city?.id
		// dataProfile.id_subd = dataProfile?.subd?.id

		// delete dataProfile.status
		// delete dataProfile.prov
		// delete dataProfile.city
		// delete dataProfile.subd
		const {status, subd, city, prov, phone, ...req} = dataProfile
		const payload = {
			...req,
			id_subd: subd?.id ?? null,
			id_city: city?.id ?? null,
			id_prov: prov?.id ?? null,
			phone: phone ?? null
		}

		// if(!dataProfile.phone){
		// 	delete dataProfile.phone
		// }
		setLoadingSave(true)
		console.log('Loading: '+loadingSave)
		reqUpdateProfile(payload).then(result => {
			console.log(result)
			getDataProfile()
			setAlert({isOpen: true, status: 'success', message: 'Edit Profil Berhasil'})
		}).catch(error => {
			console.log(error)

			// const errorValue = error.response.data.errors
			// if(errorValue.name){
			// 	setAlert({isOpen: true, status: 'warning', message: errorValue.name})
			// }else if(errorValue.username){
			// 	setAlert({isOpen: true, status: 'warning', message: errorValue.username})
			// }else if(errorValue.email){
			// 	setAlert({isOpen: true, status: 'warning', message: errorValue.email})
			// }else if(errorValue.phone){
			// 	setAlert({isOpen: true, status: 'warning', message: errorValue.phone})
			// }else{
			// 	setAlert({isOpen: true, status: 'warning', message: errorValue})
			// }
			setAlert({isOpen: true, status: 'warning', message: error.response.data.errors})
		}).finally(() => {
			setLoadingSave(false)
		})
	}

	if(loading){
		return 'Memuat . . .'
	}

	return (
		<>
		<div className={s.box}>
		<label>PROFIL</label>
		<div className={s.profile}>
		<div className={s.profilePicture}>
		<img src="/img/mi-chili-oil.jpg" />
		</div>
		<label className={s.status}>AKTIF</label>
		</div>
		<div className={s.body}>
		<div className={s.left}>
		<div className={s.inputGroup}>
		<div className={s.input}>
		<label>Nama<i className='required'> *</i></label>
		<input type="text" value={dataProfile?.name} onChange={(e) => setDataProfile({...dataProfile, name: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Username<i className='required'> *</i></label>
		<input type="username" value={dataProfile?.username} autoCapitalize='off' onChange={(e) => setDataProfile({...dataProfile, username: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>Email<i className='required'> *</i></label>
		<input type="email" value={dataProfile?.email} autoCapitalize='off' onChange={(e) => setDataProfile({...dataProfile, email: e.target.value})} />
		</div>
		<div className={s.input}>
		<label>No WhatsApp</label>
		<input type="number" value={dataProfile?.phone ?? ''} onChange={(e) => setDataProfile({...dataProfile, phone: e.target.value})} />
		</div>
		</div>
		</div>
		<div className={s.right}>
		<div className={s.inputGroup}>
		<div className={s.input}>
		<label>Provinsi<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingProv} handle={handleOpenSelectProvince} isOpen={isOpenSelectProvince} data={province} netral={'Pilih Provinsi'} onSelect={(newProv) => setDataProfile({...dataProfile, prov: newProv, city: null})} selected={dataProfile?.prov} />
		</div>
		<div className={s.input}>
		<label>Kabupaten<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingCity} handle={handleOpenSelectCity} isOpen={isOpenSelectCity} data={city} netral={'Pilih Kota/Kabupaten'} onSelect={(newCity) => setDataProfile({...dataProfile, city: newCity, subd: null})} selected={dataProfile?.city} />
		</div>
		<div className={s.input}>
		<label>Kecamatan<i className='required'> *</i></label>
		<SelectWithSearchComponent isLoading={loadingSubd} handle={handleOpenSelectSubdistrict} isOpen={isOpenSelectSubdistrict} data={subdistrict} netral={'Pilih Kecamatan'} onSelect={(newSubdistrict) => setDataProfile({...dataProfile, subd: newSubdistrict})} selected={dataProfile?.subd} />
		</div>
		<div className={s.input}>
		<label>Detail Alamat<i className='required'> *</i></label>
		{/*<input type="text" value={dataProfile?.address} onChange={(e) => setDataProfile({...dataProfile, address: e.target.value})} />*/}
		<textarea rows='3' value={dataProfile?.address} onChange={(e) => setDataProfile({...dataProfile, address: e.target.value})} />
		</div>
		</div>
		</div>
		</div>
		<div className={s.buttonGroup}>
		<button className='btn-second' disabled={loadingSave}>UBAH PASSWORD</button>
		<button className='btn-primary' onClick={btnSave} disabled={loadingSave}>SIMPAN</button>
		</div>
		</div>
		</>
		)
}

export default ProfilePage