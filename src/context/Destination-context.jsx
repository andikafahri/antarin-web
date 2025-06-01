import {createContext, useState} from 'react'

const DestinationContext = createContext()

const DestinationProvider = ({children}) => {
	const [destinationSelected, setDestinationSelected] = useState('')
	console.log(destinationSelected)

	return (
		<DestinationContext.Provider value={{destinationSelected, setDestinationSelected}}>
		{children}
		</DestinationContext.Provider>
		)
}

export {DestinationContext, DestinationProvider}