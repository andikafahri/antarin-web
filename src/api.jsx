import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_BASEURL_API
	// baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

async function getMerchantList(params) {
	const merchant = await api.get(`/public/home/merchant/list`, {params: params})

	return merchant.data.data
}

async function getCurrentMerchant(id_merchant) {
	const merchant = await api.get(`/public/merchant/${id_merchant}`)

	return merchant.data.data
}

async function getTimeOperational(id_merchant) {
	try{
		const result = await api.get(`/public/timeoperational/${id_merchant}`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getMenuList(id_merchant, filter) {
	const menu = await api.get(`/public/merchant/${id_merchant}/menu`, {params: filter})

	return menu.data.data
}

async function getDetailMenu(id_menu) {
	const menu = await api.get(`/public/menu/${id_menu}`)

	return menu.data.data
}

async function getSystemCost(id_merchant, destination) {
	try {
		const result = await api.post(`/public/system-cost/${id_merchant}`, {destination})

		return result
	}catch(error){
		throw error
	}
}

async function reqLogin(username, password) {
	try {
		const result = await api.post('/user/login', {username, password})

		return result
	}catch(error) {
		throw error
	}
}

async function reqRegister(data) {
	try {
		const result = await api.post('/user', data)

		return result
	}catch(error) {
		throw error
	}
}

async function getProfile() {
	try {
		const result = await api.get('/user')

		return result.data.data
	}catch(error) {
		throw error
	}
}

async function reqUpdateProfile(request) {
	try {
		const result = await api.patch('/user', request)

		return result.data.data
	}catch(error) {
		throw error
	}
}

async function getAddress() {
	try {
		const result = await api.get('/user/address')

		return result.data.data
	}catch(error) {
		throw error
	}
}

async function reqAddAddress(request) {
	try {
		const result = await api.post('/user/address', request)

		return result
	}catch(error) {
		throw error
	}
}

async function getAddressBookmarkedForUpdate(id_address) {
	try {
		const result = await api.get(`/user/address_bookmarked/${id_address}`)

		return result.data.data
	}catch(error) {
		throw error
	}
}

async function reqUpdateAddress(id_address, request) {
	try {
		const result = await api.put(`/user/address_bookmarked/${id_address}`, request)

		return result
	}catch(error) {
		throw error
	}
}

async function reqDeleteAddress(id_address) {
	try {
		const result = await api.delete(`/user/address/${id_address}`)

		return result
	}catch(error) {
		throw error
	}
}

async function reqBookmarkAddress(id_address) {
	try {
		const result = await api.put(`/user/address/${id_address}/to_bookmark`)

		return result
	}catch(error) {
		throw error
	}
}

async function reqCheckout(id_merchant, request) {
	try {
		const result = await api.post(`/user/order/create/${id_merchant}`, request)

		return result
	}catch(error) {
		throw error
	}
}

async function getOrder() {
	try {
		const result = await api.get('/user/order')

		return result.data.data
	}catch(error) {
		throw error
	}
}

async function reqCancel() {
	try{
		const result = await api.post(`/user/order/cancel`)
	}catch(error){
		throw error
	}
}

export {
	getMerchantList,
	getCurrentMerchant,
	getTimeOperational,
	getMenuList,
	getDetailMenu,
	getSystemCost,
	reqLogin,
	reqRegister,
	getProfile,
	reqUpdateProfile,
	getAddress,
	reqAddAddress,
	getAddressBookmarkedForUpdate,
	reqUpdateAddress,
	reqDeleteAddress,
	reqBookmarkAddress,
	reqCheckout,
	getOrder,
	reqCancel
}