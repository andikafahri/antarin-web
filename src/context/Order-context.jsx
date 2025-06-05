import {createContext, useContext, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {LoginContext} from '../context/Login-context.jsx'
import {getOrder} from '../api.jsx'

const OrderContext = createContext()

const OrderProvider = ({children}) => {
	// SAVE ID MERCHANT
	const [idMerchant, setIdMerchant] = useState('')
	const [nameMerchant, setNameMerchant] = useState('')

	// SAVE ITEM ORDER
	const [cartItems, setCartItems] = useState([])
	const addToCart = (item) => {
		setCartItems((prev) => {
			const index = prev.findIndex(i => i.variant.id === item.variant.id)
			if(index !== -1){
				const data = [...prev]
				data[index].qty += item.qty
				return data
			}
			return [...prev, item]
		})
	}

	// GET DATA ORDER
	const {token} = useContext(LoginContext)
	const [dataOrderContext, setDataOrderContext] = useState('')
	const location = useLocation()
	const navigate = useNavigate()
	const getDataOrder = async () => {
		if(token){
			// getOrder().then(result => {
			// 	setDataOrderContext(result)
			// 	console.log('INI GET DATA ORDER DI CONTEXT')
			// }).catch(error => {
			// 	if(error.status === 404){
			// 		setDataOrderContext(null)
			// 	}else{
			// 		console.log(error)

			// 		if(error.status === 401){
			// 			localStorage.removeItem('token')
			// 			console.log('REMOVE TOKEN')
			// 			navigate('/login', {state: {from: location}, replace: true})
			// 		}	
			// 	}
			// })	

			try{
				const result = await getOrder()
				setDataOrderContext(result)
				console.log('INI GET DATA ORDER DI CONTEXT')
			}catch(error){
				if(error.status === 404){
					setDataOrderContext(null)
				}else{
					console.log(error)

					if(error.status === 401){
						setDataOrderContext(null)
						localStorage.removeItem('token')
						console.log('REMOVE TOKEN')
						navigate('/login', {state: {from: location}, replace: true})
					}	
				}
			}
		}
	}
	console.log(dataOrderContext)

	return (
		<OrderContext.Provider value={{idMerchant, setIdMerchant, nameMerchant, setNameMerchant, cartItems, setCartItems, addToCart, getDataOrder, dataOrderContext}}>
		{children}
		</OrderContext.Provider>
		)
}

// const useCart = () => useContext(OrderContext)

export {OrderContext, OrderProvider}