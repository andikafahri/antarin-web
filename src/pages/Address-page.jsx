import {useContext, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {reqAddAddress} from '../api.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import s from '../styles/pages/Address.module.css'

const AddressPage = () => {
	const navigate = useNavigate()
	const {setAlert} = useContext(AlertContext)
	const {destinationSelected, setDestinationSelected} = useContext(DestinationContext)
	const [nameValue, setNameValue] = useState('')

	const [isOpenBookmark, setIsOpenBookmark] = useState(false)
	const handleBookmark = () => {
		if(!isOpenBookmark){
			setIsOpenBookmark(true)
		}else{
			setIsOpenBookmark(false)
		}
	}

	const [isLoading, setIsLoading] = useState(false)
	const handleApply = () => {
		if(!destinationSelected || !destinationSelected?.address){
			setAlert({isOpen: true, status: 'warning', message: 'Alamat tidak boleh kosong'})
			return
		}

		const request = {
			name: nameValue,
			address: destinationSelected.address,
			coordinate: {
				lat: destinationSelected.lat,
				lng: destinationSelected.lng
			},
			is_bookmark: isOpenBookmark
		}

		// for(const [key, value] of Object.entries(destinationSelected)){
		// 	request[key] = value
		// }
		console.log(request)

		setIsLoading(true)
		reqAddAddress(request).then(result => {
			navigate(sessionStorage.getItem('fromURL') || '/')
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
			}else if(error.status === 401){
				navigate('/login')
			}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}else{
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
			}
			return
		}).finally(() => {
			setIsLoading(false)
		})
	}

	return (
		<div className={s.container}>
		<div className={s.box}>
		<div className={s.bookmark}>
		<input type="text" value={nameValue} className={isOpenBookmark && s.open} onChange={e => setNameValue(e.target.value)} placeholder='Nama Bookmark (Opsional)' />
		<button onClick={handleBookmark} disabled={isLoading}><i className={isOpenBookmark ? clsx('fas fa-bookmark', s.open) : 'far fa-bookmark'}></i></button>
		</div>
		<label>Detail Alamat<i className='required'> *</i></label>
		<textarea rows='3' value={destinationSelected.address} placeholder="Cth: Jl. KH.Abdul Majid, RT.15 RW.3, Desa Ngebruk, Kec. Sumberpucung" onChange={e => setDestinationSelected({...destinationSelected, address: e.target.value})} />
		<button className='btn-primary' onClick={handleApply} disabled={isLoading}>TERAPKAN</button>
		</div>
		</div>
		)
}

export default AddressPage