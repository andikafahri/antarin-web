import {useState, useRef, useEffect, useMemo, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import clsx from 'clsx'
import {MapContainer, TileLayer, Marker, useMapEvents, useMap} from 'react-leaflet'
import L from 'leaflet'
import debounce from 'lodash.debounce'
import {AlertContext} from '../../context/Alert-context.jsx'
import 'leaflet/dist/leaflet.css'
import s from '../../styles/components/merchant-app/Map.module.css'

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
		const resp = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${import.meta.env.VITE_API_KEY_ORS}=&point.lon=${position.lng}&point.lat=${position.lat}&boundary.country=ID`, {
			headers: {
				'Accept-Language': 'id'
			}
		})
		const response = await resp.json()

		const name = response?.features[0]?.properties?.name ?? ' '
		const subd = response?.features[0]?.properties?.locality ?? ' '
		let city = response?.features[0]?.properties?.county ?? ' '
		const prov = response?.features[0]?.properties?.region ?? ' '
		const [lng, lat] = response?.features[0]?.geometry?.coordinates

		if(city.startsWith('Kota ')){
			city = city.replace('Kota ', '')
		}

		return {
			address: [name,subd,city,prov].filter(Boolean).join(', '),
			// subd: 1,
			city: city,
			prov: prov
			// lat,
			// lng
		}
	}catch(error){
		console.log(error)
	}
}

const MapComponent = ({isOpen, onClose, data, newData}) => {
	const {setAlert} = useContext(AlertContext)
	const navigate = useNavigate()
	const [searchValue, setSearchValue] = useState('')
	const [search, setSearch] = useState('')
	const [list, setList] = useState([])
	const [position, setPosition] = useState({lat: 0, lng: 0})
	const [addressData, setAddressData] = useState({})

	useEffect(() => {
		setPosition(data?.coordinates ?? {lat: 0, lng: 0})
	}, [isOpen])

	// useEffect(() => {
	// 	if(!navigator.geolocation){
	// 		console.log('GPS tidak didukung di browser ini')
	// 		setAlert({isOpen: true, status: 'danger', message: 'GPS tidak didukung di browser ini'})
	// 		return
	// 	}

	// 	navigator.geolocation.getCurrentPosition(
	// 		(positionGPS) => {
	// 			console.log('GET FROM GPS')
	// 			setPosition({lat: positionGPS.coords.latitude, lng: positionGPS.coords.longitude})
	// 		},
	// 		(error) => {
	// 			console.log(error)
	// 			setAlert({isOpen: true, status: 'danger', message: `Gagal mengambil lokasi dari GPS (${error.message})`})
	// 		}
	// 		)
	// }, [])

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
		console.log('EFFECT SORE')
		const getAddress = async () => {
			const result = await getLocation(position)

			setAddressData(result)
		}
		getAddress()
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

	// HANDLE APPLY
	const handleApply = () => {
		// addressData.lng = position.lng
		// addressData.lat = position.lat
		newData({
			address: addressData.address,
			coordinates: {
				lng: position.lng,
				lat: position.lat
			},
			cityNameView: addressData.city,
			provNameView: addressData.prov
		})
		console.log('ADDRESS APPLYED: ')
		console.log(addressData)
		// sessionStorage.setItem('location', JSON.stringify(addressData))
		// navigate('/merchant/profile')
		onClose()
	}

	return (
		<div className={clsx(s.containerMap, isOpen && s.open)}>
		<div className={clsx(s.allView)}>
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

		<div className={clsx(s.container, s.top)}>
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

		<div className={clsx(s.container, s.bottom)}>
		<div className={clsx(s.box, s.address)}>
		<div className={s.top}>
		{/*<textarea rows='2' value={addressData.address} placeholder="Cth: Jl. KH.Abdul Majid, RT.15 RW.3, Desa Ngebruk, Kec. Sumberpucung" onChange={e => setAddressData(e.target.value)} />*/}
		<label>{addressData?.address ?? 'Tentukan titik tujuan'}</label>
		{/*<span className={s.info}>Jika Kamu yakin titik sudah benar namun alamat tidak lengkap atau kurang sesuai, Kamu bisa ubah detail alamat di halaman selanjutnya.</span>*/}
		<button className='btn-primary' onClick={handleApply}>TERAPKAN</button>
		<button className='btn-second' onClick={onClose}>TUTUP</button>
		</div>
		</div>
		</div>
		</div>
		</div>
		)
}

export default MapComponent