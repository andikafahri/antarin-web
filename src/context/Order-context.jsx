import {createContext, useContext, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
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
			console.log('index: test')
			const index = prev.findIndex(i => i.variant.id === item.variant.id)
			console.log('index2:'+index)
			if(index !== -1){
				const data = [...prev]
				data[index].qty += item.qty
				return data
			}
			console.log('index3:'+index)
			return [...prev, item]
		})
	}

	// GET DATA ORDER
	const [dataOrderContext, setDataOrderContext] = useState({})
	const location = useLocation()
	const navigate = useNavigate()
	const getDataOrder = () => {
		getOrder().then(result => {
			setDataOrderContext(result)
			console.log('INI GET DATA ORDER DI CONTEXT')
		}).catch(error => {
			if(error.status === 404){
				setDataOrderContext(null)
			}else{
				console.log(error)

				if(error.status === 401){
				// window.location.href = '/login'
					navigate('/login', {state: {from: location}, replace: true})
				}	
			}
		})
	}

	return (
		<OrderContext.Provider value={{idMerchant, setIdMerchant, nameMerchant, setNameMerchant, cartItems, setCartItems, addToCart, getDataOrder, dataOrderContext}}>
		{children}
		</OrderContext.Provider>
		)
}

// const useCart = () => useContext(OrderContext)

export {OrderContext, OrderProvider}