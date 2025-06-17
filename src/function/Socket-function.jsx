import {io} from 'socket.io-client'

const socket = (token, role) => {
	return io(`${import.meta.env.VITE_BASEURL}/${role}`, {
		autoConnect: false,
		query: {
			token: token
		}
	})
}

export default socket