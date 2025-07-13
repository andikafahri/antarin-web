import {useContext, useState, useEffect} from 'react'
import {useNavigate, useLocation, Link} from 'react-router-dom'
import clsx from 'clsx'
import {getAddress, reqDeleteAddress, reqBookmarkAddress} from '../api.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import s from '../styles/components/Destination-popup.module.css'

const DestinationPopupComponent = ({isOpen, onClose}) => {
	const navigate = useNavigate()
	const location = useLocation()
	const {setAlert} = useContext(AlertContext)
	const [dataAddress, setDataAddress] = useState([])

	// const dataDestination = [
	// 	'Jl. KH Abd Masjid, RT.15 RW.3 Desa Ngebruk, Kec.Sumberpucung',
	// 	'Ngebruk',
	// 	'Sambigede',
	// 	'Senggreng',
	// 	'Slorok'
	// ]

	useEffect(() => {
		getDataAddress()
	}, [])

	const [loading, setLoading] = useState(false)
	const getDataAddress = () => {
		setLoading(true)
		getAddress().then(result => {
			const groupData = {
				bookmark: [],
				not_bookmark: []
			}

			result?.forEach(list => {
				const {is_bookmark, ...listWithoutIsBookmark} = list
				if(is_bookmark){
					groupData.bookmark.push(listWithoutIsBookmark)
				}else{
					groupData.not_bookmark.push(listWithoutIsBookmark)
				}
			})

			console.log(result)
			setDataAddress(groupData)
		}).catch(error => {
			
		}).finally(() => {
			setLoading(false)
		})
	}

	console.log(dataAddress)

	const {setDestinationSelected} = useContext(DestinationContext)
	const selectDestination = (destination) => {
		console.log(destination)
		setDestinationSelected({
			name: destination?.name ?? null,
			address: destination?.address ?? null,
			lng: parseFloat(destination.coordinate.lng),
			lat: parseFloat(destination.coordinate.lat)
		})
	}

	const [loadingBtn, setLoadingBtn] = useState(false)
	const handleDelete = (id_address) => {
		setLoadingBtn(true)
		reqDeleteAddress(id_address).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Berhasil'})
			getDataAddress()
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
			setLoadingBtn(false)
		})
	}

	const handleSave = (id_address) => {
		setLoadingBtn(true)
		reqBookmarkAddress(id_address).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Berhasil'})
			getDataAddress()
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
			setLoadingBtn(false)
		})
	}

	const handleOpenMap = () => {
		console.log(location)
		sessionStorage.setItem('fromURL', location.pathname)
		navigate('/map')
	}

	return (
		<>
		<div role='button' className={clsx(s.background, isOpen ? s.open : '')} onClick={(e) => {if(e.target === e.currentTarget) onClose()}}>
		<div className={s.container}>
		<div className={s.scrollArea}>
		{dataAddress?.bookmark ? (
			<>
			<h1>Tersimpan</h1>
			{dataAddress?.bookmark?.map((data, i) => {
				return (
					<div key={i}>
					<div role='button' className={clsx(s.item, 'notHighlight', loadingBtn && s.disabled)} onClick={() => {
						selectDestination(data)
						onClose()
					}}>
					{data.name ? (
						<>
						<label style={{fontWeight: 'bold'}}>{data.name}</label>
						<label style={{color: 'var(--gray-color)'}}>{data.address}</label>
						</>
						) : (
						<label style={{fontWeight: 'bold'}}>{data.address}</label>
						)}
						<Link to={`/address/${data.id}`} className={s.btnUpdate} onClick={(e) => {
							e.stopPropagation();
							sessionStorage.setItem('fromURL', location.pathname);
						}}>Edit</Link>
						</div>
						</div>
						)
			})}
			</>
			) : ''
	}
	{dataAddress?.not_bookmark ? (
		<>
		<h1>Riwayat</h1>
		{dataAddress?.not_bookmark?.map((data, i) => {
			return (
				<div key={i}>
				<div role='button' className={clsx(s.item, 'notHighlight', loadingBtn && s.disabled)} onClick={() => {
					selectDestination(data)
					onClose()
				}}>
				<label>{data.address}</label>
				<div className={s.btnGroup}>
				<Link className={s.btnDelete} onClick={(e) => {
					e.stopPropagation();
					handleDelete(data.id);
				}}>Hapus</Link>
				<Link className={s.btnUpdate} onClick={(e) => {
					e.stopPropagation();
					handleSave(data.id);
				}}>Simpan</Link>
				</div>
				</div>
				</div>
				)
		})}
		</>
		) : ''}
	</div>
	<button className='btn-second' onClick={handleOpenMap} disabled={loadingBtn}>Buka Peta</button>
	</div>
	</div>
	</>
	)
}

export default DestinationPopupComponent