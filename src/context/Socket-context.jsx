import {createContext, useEffect, useState, useContext, useRef} from 'react'
import socket from '../function/Socket-function.jsx'
import {LoginContext} from '../context/Login-context.jsx'

const SocketContext = createContext()

const SocketProvider = ({children}) => {
	const {token} = useContext(LoginContext)
	const [roleSocket, setRoleSocket] = useState(null)
	const [useSocket, setUseSocket] = useState()
	const socketRef = useRef(null)

	useEffect(() => {
		if(token && roleSocket){
			socketRef.current = socket(token, roleSocket)
			socketRef.current.connect()
			setUseSocket(socketRef.current)
			console.log('SOCKET IS CONNECTED')
			console.log(socketRef.current)

			return () => {
				socketRef.current?.disconnect()
				console.log('SOCKET DISCONNECTED')
			}
		}
	}, [token, roleSocket])

	return (
		<SocketContext.Provider value={{useSocket, setRoleSocket}}>
		{children}
		</SocketContext.Provider>
		)
}

export {SocketContext, SocketProvider}