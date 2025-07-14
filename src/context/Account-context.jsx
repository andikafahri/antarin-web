import {createContext, useState, useEffect} from 'react'
import {getProfile} from '../api.jsx'

const AccountContext = createContext()

const AccountProvider = ({children}) => {
	const [loadingProfileCtx, setLoadingProfileCtx] = useState(true)
	const [profileCtx, setProfileCtx] = useState({})

	useEffect(() => {
		getDataProfileCtx()
	}, [])

	const getDataProfileCtx = () => {
		setLoadingProfileCtx(true)
		getProfile().then(result => {
			setProfileCtx(result)
		}).catch(error => {
			console.log(error)
			if(error.status === 401){
				setIsLogin(false)
				localStorage.removeItem('token')
			}
		}).finally(() => {
			setLoadingProfileCtx(false)
		})
		console.log('ACCOUNT CONTEXT')
	}
	console.log(profileCtx)

	return (
		<AccountContext.Provider value={{loadingProfileCtx, getDataProfileCtx, profileCtx}}>
		{children}
		</AccountContext.Provider>
		)
}

export {AccountContext, AccountProvider}