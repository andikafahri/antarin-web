import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {AlertContext} from '../context/Alert-context.jsx'
import {getProfile, reqUpdateProfile} from '../api.jsx'
import profileStyle from '../styles/pages/Profile.module.css'

const ProfilePage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [dataProfile, setDataProfile] = useState({})

	const getDataProfile = () => {
		getProfile().then(result => {
			console.log(result)
			setDataProfile(result)
		}).catch(error => {
			console.log(error)
			if(error.status === 401){
				navigate('/login', {state: {from: location}, replace: true})
			}
		})
	}

	useEffect(() => {
		console.log('PROFILE PAGE')
		getDataProfile()
	}, [])

	const {setAlert} = useContext(AlertContext)
	const [loading, setLoading] = useState(false)
	const btnSave = () => {
		const {status, ...request} = dataProfile
		if(!dataProfile.phone){
			delete request.phone
		}
		setLoading(true)
		console.log('Loading: '+loading)
		reqUpdateProfile(request).then(result => {
			console.log(result)
			getDataProfile()
			setAlert({isOpen: true, status: 'success', message: 'Edit Profil Sukses'})
		}).catch(error => {
			console.log(error)

			const errorValue = error.response.data.errors
			if(errorValue.name){
				setAlert({isOpen: true, status: 'warning', message: errorValue.name})
			}else if(errorValue.username){
				setAlert({isOpen: true, status: 'warning', message: errorValue.username})
			}else if(errorValue.email){
				setAlert({isOpen: true, status: 'warning', message: errorValue.email})
			}else if(errorValue.phone){
				setAlert({isOpen: true, status: 'warning', message: errorValue.phone})
			}else{
				setAlert({isOpen: true, status: 'warning', message: errorValue})
			}
		}).finally(() => {
			setLoading(false)
		})
	}

	return (
		<>
		<Helmet>
		<title>Profil</title>
		</Helmet>
		<div className={profileStyle.box}>
		<div className={profileStyle.profile}>
		<div className={profileStyle.profilePicture}>
		<img src="/img/profile.jpg" />
		</div>
		<label className={profileStyle.status}>AKTIF</label>
		</div>
		<div className={profileStyle.inputGroup}>
		<div className={profileStyle.input}>
		<label>Nama</label>
		<input type="text" value={dataProfile?.name ?? ''} onChange={(e) => setDataProfile({...dataProfile, name: e.target.value})} />
		</div>
		<div className={profileStyle.input}>
		<label>Username</label>
		<input type="username" value={dataProfile?.username ?? ''} autoCapitalize='off' onChange={(e) => setDataProfile({...dataProfile, username: e.target.value})} />
		</div>
		<div className={profileStyle.input}>
		<label>Email</label>
		<input type="email" value={dataProfile?.email ?? ''} autoCapitalize='off' onChange={(e) => setDataProfile({...dataProfile, email: e.target.value})} />
		</div>
		<div className={profileStyle.input}>
		<label>No WhatsApp</label>
		<input type="number" value={dataProfile?.phone ?? ''} onChange={(e) => setDataProfile({...dataProfile, phone: e.target.value})} />
		</div>
		</div>
		<div className={profileStyle.buttonGroup}>
		<button className='btn-primary' onClick={btnSave} disabled={loading}>SIMPAN</button>
		<button className='btn-second' disabled={loading}>UBAH PASSWORD</button>
		</div>
		</div>
		</>
		)
}

export default ProfilePage