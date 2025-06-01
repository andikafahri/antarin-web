import {createContext, useState} from 'react'
import AlertComponent from '../components/Alert-component.jsx'

const AlertContext = createContext()

const AlertProvider = ({children}) => {
	const [alert, setAlert] = useState({isOpen: false, status: '', message: ''})
	const [statusAlert, setStatusAlert] = useState('')

	return (
		<AlertContext.Provider value={{alert, setAlert, setStatusAlert}}>
		<AlertComponent isOpen={alert.isOpen} status={alert.status} message={alert.message} />
		{children}
		</AlertContext.Provider>
		)
}

export {AlertContext, AlertProvider}