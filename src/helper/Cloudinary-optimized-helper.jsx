export function CloudinaryOptimized(imageUrl) {
	let finalUrl
	if(imageUrl){
		if(imageUrl.includes('https://res.cloudinary.com/') && imageUrl.startsWith('https://res.cloudinary.com/')){
			const urlObj = new URL(imageUrl)
			const pathUrl = urlObj.pathname
			const parts = pathUrl.split('/')
			const firstPart = parts.slice(1, 4).join('/')
			const secondPart = parts.slice(4).join('/')
			const newPart = 'f_auto,q_auto'
			finalUrl = `https://res.cloudinary.com/${firstPart}/${newPart}/${secondPart}`
		}else{
			finalUrl = imageUrl
		}
	}

	return finalUrl
}