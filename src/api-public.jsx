import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_BASEURL_API
})

async function getProvince() {
	try{
		const result = await api.get('/datacenter/province')

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getCity(id_province) {
	try{
		const result = await api.get(`/datacenter/city/${id_province}`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getSubdistrict(id_city) {
	try{
		const result = await api.get(`/datacenter/subdistrict/${id_city}`)

		return result.data.data
	}catch(error){
		throw error
	}
}

async function getCategory() {
	try{
		const result = await api.get(`/datacenter/category`)

		return result.data.data
	}catch(error){
		throw error
	}
}

export {
	getProvince,
	getCity,
	getSubdistrict,
	getCategory
}