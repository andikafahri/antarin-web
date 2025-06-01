import {createContext, useState, useEffect} from 'react'

const LoginContext = createContext()

const LoginProvider = ({children}) => {
	const [token, setToken] = useState('')
	const tokenValue = localStorage.getItem('token') || ''

	useEffect(() => {
		setToken(tokenValue)
	}, [tokenValue])
	console.log('Token: '+token)

	return (
		<LoginContext.Provider value={{token, setToken}}>
		{children}
		</LoginContext.Provider>
		)
}

export {LoginContext, LoginProvider}