import axios from 'axios'

const api = axios.create({
	// baseURL: import.meta.env.VITE_BASEURL_API_MERCHANT
	baseURL: import.meta.env.VITE_BASEURL_API
	// baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

async function reqRegister(request) {
	try{
		const result = await api.post('/merchant', request)

		return result.data
	}catch(error){
		throw error
	}
}

async function reqLogin(username, password) {
	try{
		const result = await api.post('/merchant/login', {username, password})

		return result.data
	}catch(error){
		throw error
	}
}

async function getProfile(username, password) {
	try{
		const result = await api.get('/merchant')

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqUpdateProfile(request) {
	try{
		const result = await api.patch('/merchant', request)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getOrder(status_order) {
	try{
		const result = await api.get('/merchant/order', {params: {status: status_order}})

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqAccept(id_order) {
	try{
		const result = await api.post(`/merchant/order/${id_order}/accept`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqReject(id_order) {
	try{
		const result = await api.post(`/merchant/order/${id_order}/reject`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqFinish(id_order) {
	try{
		const result = await api.post(`/merchant/order/${id_order}/finish`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getCategory() {
	try{
		const result = await api.get(`/category`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getMenu(filter) {
	try{
		const result = await api.get(`/menu`, {params: filter})

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqAddMenu(request) {
	try{
		const result = await api.post(`/menu`, request)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function reqUpdateMenu(idMenu, request) {
	try{
		const result = await api.put(`/menu/${idMenu}`, request)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function reqDeleteMenu(idMenu) {
	try{
		const result = await api.delete(`/menu/${idMenu}`)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function getTimeOperational() {
	try{
		const result = await api.get('/merchant/timeoperational')

		return result.data.data
	}catch(error){
		throw error
	}
}

async function reqAddTimeOperational(request) {
	try{
		const result = await api.post('/merchant/timeoperational', request)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function reqUpdateTimeOperational(id, request) {
	try{
		const result = await api.put(`/merchant/timeoperational/${id}`, request)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function reqDeleteTimeOperational(id) {
	try{
		const result = await api.delete(`/merchant/timeoperational/${id}`)

		return result.data.message
	}catch(error){
		throw error
	}
}

async function reqChangeMode(mode) {
	try{
		const result = await api.post(`/merchant/timeoperational/changemode/${mode}`)

		return result.data.message
	}catch(error){
		throw error
	}
}

export {
	reqRegister,
	reqLogin,
	getProfile,
	reqUpdateProfile,
	getOrder,
	reqAccept,
	reqReject,
	reqFinish,
	getCategory,
	getMenu,
	reqAddMenu,
	reqUpdateMenu,
	reqDeleteMenu,
	getTimeOperational,
	reqAddTimeOperational,
	reqUpdateTimeOperational,
	reqDeleteTimeOperational,
	reqChangeMode
}