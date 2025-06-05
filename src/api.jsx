import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_BASEURL
	// baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

// const getMerchantList = async (filter) => {
async function getMerchantList(filter) {
	// const baseUrl = process.env.REACT_APP_BASEURL
	// const baseUrl = import.meta.env.REACT_APP_BASEURL
	// const merchant = await axios.get(`${baseUrl}/public/merchant/list`)
	const merchant = await api.get(`/public/home/merchant/list`, {params: filter})

	return merchant.data.data
}

// const getCurrentMerchant = async (id_merchant) => {
async function getCurrentMerchant(id_merchant) {
	const merchant = await api.get(`/public/merchant/${id_merchant}`)

	return merchant.data.data
}

// const getMenuList = async (id_merchant, filter) => {
async function getMenuList(id_merchant, filter) {
	// const menu = await api.get(`/public/merchant/${id_merchant}?category=${filterCategory}`)
	const menu = await api.get(`/public/merchant/${id_merchant}/menu`, {params: filter})

	return menu.data.data
}

// const getSystemCost = async (destination) => {
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

// const reqCheckout = async (id_merchant, request) => {
async function reqCheckout(id_merchant, request) {
	try {
		// const result = await api.post(`/user/order/${id_merchant}`, request, {
		// 	headers: {
		// 		Authorization: ''
		// 	}
		// })

		const result = await api.post(`/user/order/${id_merchant}`, request)

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

async function reqCancel(id_order) {
	try{
		const result = await api.post(`/user/order/cancel/${id_order}`)
	}catch(error){
		throw error
	}
}

export {
	getMerchantList,
	getCurrentMerchant,
	getMenuList,
	getSystemCost,
	reqLogin,
	getProfile,
	reqUpdateProfile,
	reqCheckout,
	getOrder,
	reqCancel
}