import {createContext, useEffect, useContext} from 'react'
import socket from '../function/Socket-function.jsx'
import {LoginContext} from '../context/Login-context.jsx'

const SocketContext = createContext()

const SocketProvider = ({children}) => {
	const {token} = useContext(LoginContext)

	useEffect(() => {
		if(token){
			socket.connect()
			console.log('SOCKET IS CONNECTED')

			return () => {
				socket.disconnect()
				console.log('SOCKET DISCONNECTED')
			}	
		}
	}, [token])

	return (
		<SocketContext.Provider value={socket}>
		{children}
		</SocketContext.Provider>
		)
}

export {SocketContext, SocketProvider}