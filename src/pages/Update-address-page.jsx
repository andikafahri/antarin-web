import {useState, useRef, useEffect, useMemo, useContext} from 'react'
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import clsx from 'clsx'
import {MapContainer, TileLayer, Marker, useMapEvents, useMap} from 'react-leaflet'
import L from 'leaflet'
import debounce from 'lodash.debounce'
import {getAddressBookmarkedForUpdate, reqUpdateAddress, reqDeleteAddress} from '../api.jsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import 'leaflet/dist/leaflet.css'
import s from '../styles/pages/Map.module.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

// MARKER FROM LEAFLET
const DraggableMarker = ({position, setPosition}) => {
	const map = useMap()
	const markerRef = useRef(null)

	useEffect(() => {
		if(position){
			map.setView(position, map.getZoom())
		}
	}, [position])

	return (
		<Marker
		draggable={true}
		position={position}
		eventHandlers={{
			dragend() {
				const marker = markerRef.current
				if(marker != null){
					setPosition(marker.getLatLng())
				}
			},
		}}
		ref={markerRef}
		/>
		)
}

// MARKER CUSTOM (TIDAK DIPAKAI)
const CenterMarker = ({position, onCenter}) => {
	const map = useMap()
	useEffect(() => {
		if(position){
			map.setView(position, map.getZoom())
			// onCenter(map.getCenter())
		}
	}, [position])

	useMapEvents({
		move(){
			const map = this
			onCenter(map.getCenter())
		}
	})
}

// SEARCH LOCATION BY NAME FROM ORS API
const searchLocation = async (search) => {
	try{
		const resp = await fetch(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_API_KEY_ORS}=&text=${search}&boundary.country=ID`)
		const response = await resp.json()

		let result = []
		response.features.map((item, i) => {
			const name = item.properties?.name ?? ' '
			const subd = item.properties?.locality ?? ' '
			const city = item.properties?.county ?? ' '
			const prov = item.properties?.region ?? ' '
			const [lng, lat] = item.geometry.coordinates

			result.push({
				name: [name,subd,city,prov].filter(Boolean).join(', '),
				lat,
				lng
			})
		})

		return result
	}catch(error){
		console.log(error)
	}
}

// GET LOCATION BY COORDINATE FROM ORS API
const getLocation = async (position) => {
	try{
		const resp = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${import.meta.env.VITE_API_KEY_ORS}=&point.lon=${position.lng}&point.lat=${position.lat}&boundary.country=ID`)
		const response = await resp.json()

		const name = response?.features[0]?.properties?.name ?? ' '
		const subd = response?.features[0]?.properties?.locality ?? ' '
		const city = response?.features[0]?.properties?.county ?? ' '
		const prov = response?.features[0]?.properties?.region ?? ' '
		const [lng, lat] = response?.features[0]?.geometry?.coordinates

		return {
			address: [name,subd,city,prov].filter(Boolean).join(', '),
			// subd: 1,
			// city: response?.features[0]?.properties?.county_a,
			// prov: response?.features[0]?.properties?.region_a,
			// lat,
			// lng
		}
	}catch(error){
		console.log(error)
	}
}

const MapPage = () => {
	const {id_address} = useParams()
	const navigate = useNavigate()
	const {setAlert} = useContext(AlertContext)
	const [searchValue, setSearchValue] = useState('')
	const [search, setSearch] = useState('')
	const [list, setList] = useState([])
	const [position, setPosition] = useState({lat: 0, lng: 0})
	const [addressData, setAddressData] = useState({})

	useEffect(() => {
		getDataAddress(id_address)
	}, [])

	const [loadingData, setLoadingData] = useState(true)
	const getDataAddress = (id_address) => {
		setLoadingData(true)
		getAddressBookmarkedForUpdate(id_address).then(result => {
			console.log(result)
			setAddressData({
				name: result.name,
				address: result.address,
				lng: result.coordinate.lng,
				lat: result.coordinate.lat
			})
			setPosition({
				lng: result.coordinate.lng,
				lat: result.coordinate.lat
			})
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
			setLoadingData(false)
		})
	}

	// SEARCH
	const delaySearch = useMemo(() => 
		debounce(val => {
			setSearch(val)
		}, 500), [searchValue])

	useEffect(() => {
		delaySearch(searchValue)
		return () => delaySearch.cancel()
	}, [searchValue])

	useEffect(() => {
		const regex = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/
		const match = search.match(regex)

		if(!match){
			const getList = async () => {
				const result = await searchLocation(search)
				setList(result)
				if(result.length !== 0){
					setIsOpenList(true)
				}else{
					setIsOpenList(false)
				}
			}
			getList()
		}else{
			setPosition({lat: parseFloat(match[1]), lng: parseFloat(match[3])})
		}
	}, [search])

	// GET ADDRESS FROM API BY COORDINATES
	useEffect(() => {
		if(!loadingData){
			if(parseFloat(addressData.lng) !== parseFloat(position.lng) && parseFloat(addressData.lat) !== parseFloat(position.lat)){
				const getAddress = async () => {
					const result = await getLocation(position)
					setAddressData(prev => ({
						...prev,
						address: result.address,
						lng: position.lng,
						lat: position.lat
					}))
				}
				getAddress()
			}
		}
	}, [position])

	// LIST COMPONENT
	const List = () => {
		console.log(list)
		return list?.map((item, i) => {
			return (
				<div role='button' className={s.row} key={i} onClick={() => handleSelectAddressFromList(item.lat, item.lng)}>{item.name}</div>
				)
		})
	}

	console.log(position)

	// HANDLE SELECT ADDRESS FROM LIST
	const handleSelectAddressFromList = (lat, lng) => {
		setPosition({lat: lat, lng: lng})
		setIsOpenList(false)
	}

	// HANDLE OPEN LIST
	const [isOpenList, setIsOpenList] = useState(false)
	const handleList = () => {
		setIsOpenList(x => !x)
	}

	// HANDLE SAVE
	const {setDestinationSelected} = useContext(DestinationContext)
	const [btnLoading, setBtnLoading] = useState(false)
	const handleSave = () => {
		const request = {
			name: addressData.name,
			address: addressData.address,
			coordinate: {
				lng: addressData.lng,
				lat: addressData.lat
			}
		}

		console.log(request)

		setBtnLoading(true)
		reqUpdateAddress(id_address, request).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Berhasil'})
			setDestinationSelected({})
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
			setBtnLoading(false)
		})
	}

	const handleDelete = () => {
		setBtnLoading(true)
		reqDeleteAddress(id_address).then(result => {
			setAlert({isOpen: true, status: 'success', message: 'Berhasil'})
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
			setBtnLoading(false)
		})
	}

	return (
		<>
		<MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{height: '100vh', width: '100%'}}>
		<TileLayer
		url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		attribution='&copy; OpenStreetMap contributors'
		/>
		<DraggableMarker position={position} setPosition={setPosition} />
		{/*<CenterMarker position={position} onCenter={(latlng) => setPosition(latlng)} />*/}
		</MapContainer>

		{/*MARKER CUSTOM*/}
		{/*<div
		style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			zIndex: '999',
			transform: 'translate(-50%, -100%)',
			pointerEvents: 'none',
			fontSize: '32px',
		}}
		>
		📍
		</div>*/}


		{/*<input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
		<button onClick={handleSearch}>CARI</button>
		<div style={{marginTop: '1rem'}}>
		Latitude: {position.lat.toFixed(6)}<br />
		Longitude: {position.lat.toFixed(6)}
		</div>*/}

		<div className={clsx(s.container, s.update, s.top)}>
		<div className={clsx(s.box, s.search)}>
		<input type="text" value={searchValue} placeholder='Cari alamat atau Masukkan Titik Koordinat' onChange={e => setSearchValue(e.target.value)} />
		</div>

		<div className={clsx(s.box, s.list, isOpenList && s.open)}>
		<List />
		</div>
		<div className={clsx(s.btnHandleList, list?.length !== 0 && s.show)}>
		<button onClick={handleList}><i className={clsx('fas fa-chevron-down', isOpenList && s.open)}></i></button>
		</div>
		</div>

		<div className={clsx(s.container, s.update, s.bottom)}>
		<div className={clsx(s.box, s.address)}>
		<div className={s.top}>
		<input type="text" value={addressData?.name} placeholder='Nama Bookmark (Opsional)' onChange={e => setAddressData({...addressData, name: e.target.value})} />
		<label>Detail Alamat<i className='required'> *</i></label>
		<textarea rows='2' value={addressData?.address} placeholder="Cth: Jl. KH.Abdul Majid, RT.15 RW.3, Desa Ngebruk, Kec. Sumberpucung" onChange={e => setAddressData({...addressData, address: e.target.value})} />
		<div className={s.btnGroup}>
		<button className='btn-danger solid' onClick={handleDelete} disabled={btnLoading}>HAPUS</button>
		<button className='btn-primary' onClick={handleSave} disabled={btnLoading}>SIMPAN</button>
		</div>
		</div>
		</div>
		</div>
		</>
		)
}

export default MapPage