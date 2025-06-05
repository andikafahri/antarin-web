import {useState, useEffect, useContext} from 'react'
import {useParams, Link} from 'react-router-dom'
import clsx from 'clsx'
import {AlertContext} from '../context/Alert-context.jsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import {OrderContext} from '../context/Order-context.jsx'
import {LoginContext} from '../context/Login-context.jsx'
import {getSystemCost, reqCheckout} from '../api.jsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const CheckoutComponent = () => {
	// GET NAME MERCHANT
	const {nameMerchant} = useContext(OrderContext)

	// GET SYSTEM COST
	const {destinationSelected} = useContext(DestinationContext)
	const [shippingCost, setShippingCost] = useState(0)
	const [serviceCost, setServiceCost] = useState(0)
	useEffect(() => {
		if(!destinationSelected) return
			getSystemCost(destinationSelected).then(result => {
				setShippingCost(result.data.data.shipping_cost)
				setServiceCost(result.data.data.service_cost)
			}).catch(error => {
				console.log(error.response.data.errors)
			})
		}, [destinationSelected])

	// LIST CHECKOUT
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
	const toggleListOrder = () => {
		setIsCheckoutOpen((x) => !x)
	}

	const {cartItems, setCartItems} = useContext(OrderContext)
	const [totalPriceItem, setTotalPriceItem] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)
	const totalQty = cartItems.reduce((total, item) => total + item.qty, 0)

	useEffect(() => {
		const newTotal = cartItems.reduce((sum, item) => {
			return sum+item.price*item.qty
		}, 0)
		setTotalPriceItem(newTotal)
		setTotalPrice(Number(newTotal)+Number(shippingCost)+Number(serviceCost))

		if(newTotal === 0){
			setTotalPrice(0)
		}
	}, [cartItems, shippingCost, serviceCost])
	
	const CartItem = () => {
		if(cartItems.length === 0) {
			return <div style={{textAlign: 'center', padding: '50px', color: 'var(--gray-color)'}}>Belum Ada Item</div>
		}


		return (
			<>
			{cartItems.map((item, i) => {
				return (
					<div key={i}>
					<div className={merchantStyle.item}>
					<div className={merchantStyle.picture}>
					<img src='/img/1.jpg' />
					</div>
					<div className={merchantStyle.infoItem}>
					<div className={merchantStyle.top}>
					<div className={merchantStyle.left}>
					<h3>{item.name}</h3>
					<h4>{item.variant.name}</h4>
					</div>
					<div className={merchantStyle.right}>
					<h4>x{item.qty}</h4>
					</div>
					</div>
					<div className={merchantStyle.bottom}>
					<label htmlFor="">{(item.price * item.qty).toLocaleString('id-ID')}</label>
					</div>
					</div>
					</div>
					</div>
					)
			})}
			<div className={merchantStyle.itemSystem}>
			<div className={merchantStyle.shippingCostItem}>
			<h3>Ongkos kirim</h3>
			<h4>{shippingCost.toLocaleString('id-ID')}</h4>
			</div>
			<div className={merchantStyle.serviceCost}>
			<h3>Biaya layanan</h3>
			<h4>{serviceCost.toLocaleString('id-ID')}</h4>
			</div>
			</div>
			</>
			)
		// })
	}



	// CHECKOUT
	// const {id_merchant} = useParams()
	const {idMerchant} = useContext(OrderContext)
	const {alert, setAlert} = useContext(AlertContext)
	const {getDataOrder} = useContext(OrderContext)
	const {token} = useContext(LoginContext)
	const [loading, setLoading] = useState(false)
	const checkout = () => {
		const items = cartItems.map(item => ({
			id_menu: item.id,
			id_variant: item.variant.id,
			qty: item.qty
			// note: item.note
		}))

		const request = {
			destination: destinationSelected,
			id_subd: 1,
			id_city: 1,
			id_prov: 1,
			items
		}

		if(!request.destination || request.items.length === 0){
			setAlert({isOpen: true, status: 'warning', message: 'Harap pilih item dan alamat tujuan terlebih dahulu'})
			return
		}

		console.log('TOKEN FOR CHECKOUT: '+token)
		if(!token){
			setAlert({isOpen: true, status: 'danger', message: 'Lakukan login untuk memesan'})
			return
		}

		console.log(request)
		setLoading(true)
		reqCheckout(idMerchant, request).then((result) => {
			console.log(result.data.message)
			setAlert({isOpen: true, status: 'success', message: 'Order Sukses'})
			getDataOrder()
			setCartItems([])
		}).catch(error => {
			console.log(error.response.data.errors)
			if(error.status === 500){
				setAlert({isOpen: true, status: 'danger', message: 'Maaf, server error'})
			}
		}).finally(() => {
			setLoading(false)
		})
	}

	useEffect(() => {
		if(isCheckoutOpen){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}
	}, [isCheckoutOpen])

	return (
		<>
		<div className={clsx(merchantStyle.listItemContainer, isCheckoutOpen && merchantStyle.open)}>
		<div className={merchantStyle.listItem}>
		<div className={merchantStyle.itemGroup}>
		<CartItem />
		</div>
		</div>
		</div>
		<div className={clsx(merchantStyle.checkout)}>
		{cartItems.length !== 0 ? <Link to={`/${idMerchant}`} className={merchantStyle.nameMerchant}>{nameMerchant}</Link> : ''}
		<div className={merchantStyle.final}>
		<div role='button' tabIndex='0' onClick={toggleListOrder} className={merchantStyle.totalPrice}>
		<div className={merchantStyle.text}>
		<label htmlFor="">Total <span>({totalQty} item)</span></label>
		<h1>Rp {(Number(totalPrice)).toLocaleString('id-ID')}</h1>
		</div>
		<div className={clsx(merchantStyle.icon, isCheckoutOpen && merchantStyle.down)}>
		<i className="fas fa-chevron-up"></i>
		</div>
		</div>
		<div className={merchantStyle.btnOrder}>
		<button className="btn-primary" onClick={checkout} disabled={loading}>PESAN</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(merchantStyle.checkoutContainer, isCheckoutOpen && merchantStyle.open)} onClick={(e) => {
			if(e.target === e.currentTarget){setIsCheckoutOpen(false)}
		}}>
	</div>
	</>
	)
}

export default CheckoutComponent