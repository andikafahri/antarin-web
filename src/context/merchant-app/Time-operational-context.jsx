import {useState, useEffect, useContext, createContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {AlertContext} from '../../context/Alert-context.jsx'
import {getTimeOperational} from '../../api-merchant-app.jsx'

const TimeOperationalContext = createContext()

const TimeOperationalProvider = ({children}) => {
	const navigate = useNavigate()
	const location = useLocation()
	const {setAlert} = useContext(AlertContext)
	const [loading, setLoading] = useState(true)
	const [timeOperational, setTimeOperational] = useState([])

	useEffect(() => {
		getTime()
	}, [])

	const getTime = () => {
		setLoading(true)
		getTimeOperational().then(result => {
			setTimeOperational(result)
		}).catch(error => {
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Server error'})
			}else if(error.status === 401){
				navigate('/merchant/login', {state: {from: location}, replace: true})
			}else if(error.status === 400 || error.status === 402 || error.status === 403 || error.status === 404){
				setAlert({isOpen: true, status: 'danger', message: error.response.data.errors})
			}else{
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, terjadi kesalahan'})
			}
			return
		}).finally(() => {
			setLoading(false)
		})
	}

	return (
		<TimeOperationalContext.Provider value={{getTime, loading, timeOperational}}>
		{children}
		</TimeOperationalContext.Provider>
		)
}

export {TimeOperationalContext, TimeOperationalProvider}