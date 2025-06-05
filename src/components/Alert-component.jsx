import {useState, useEffect, useContext} from 'react'
import clsx from 'clsx'
import {AlertContext} from '../context/Alert-context.jsx'
import alertStyle from '../styles/components/Alert.module.css'

const AlertComponent = ({isOpen, status, message}) => {
	// const [isOpen, setIsOpen] = useState(true)

	const {setAlert} = useContext(AlertContext)
	useEffect(() => {
	// if(open){
		const timer = setTimeout(() => {
			setAlert({isOpen: false, status: '', message: ''})
			// open = false
		}, 3500)
		return() => clearTimeout(timer)
	// }
	}, [isOpen])

	return(
		<>
		<div className={clsx(alertStyle.alert, alertStyle[status], isOpen && alertStyle.open)}>
		<p>{message}</p>
		</div>
		</>
		)
}

export default AlertComponent