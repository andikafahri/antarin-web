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

async function getMerchantList(filter) {
	const merchant = await api.get(`/public/home/merchant/list`, {params: filter})

	return merchant.data.data
}

async function getCurrentMerchant(id_merchant) {
	const merchant = await api.get(`/public/merchant/${id_merchant}`)

	return merchant.data.data
}

async function getTimeOperational() {
	try{
		const result = await api.get('/public/timeoperational')

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getMenuList(id_merchant, filter) {
	const menu = await api.get(`/public/merchant/${id_merchant}/menu`, {params: filter})

	return menu.data.data
}

async function getSystemCost(destination) {
	try {
		const result = await api.post('/public/system-cost', {destination})

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
	getSystemCost,
	reqLogin,
	reqRegister,
	getProfile,
	reqUpdateProfile,
	reqCheckout,
	getOrder,
	reqCancel
}