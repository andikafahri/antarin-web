import {useContext} from 'react'
import clsx from 'clsx'
import {DestinationContext} from '../context/Destination-context.jsx'
import destinationStyle from '../styles/components/Destination-popup.module.css'

const DestinationPopupComponent = ({isOpen, onClose}) => {
	const dataDestination = [
		'Jl. KH Abd Masjid, RT.15 RW.3 Desa Ngebruk, Kec.Sumberpucung',
		'Ngebruk',
		'Sambigede',
		'Senggreng',
		'Slorok'
	]

	const {setDestinationSelected} = useContext(DestinationContext)
	const selectDestination = (destinationValue) => {
		setDestinationSelected(destinationValue)
	}

	return (
		<>
		<div role='button' className={clsx(destinationStyle.background, isOpen ? destinationStyle.open : '')} onClick={(e) => {if(e.target === e.currentTarget) onClose()}}>
		<div className={destinationStyle.container}>
		<div className={destinationStyle.scrollArea}>
		<h1>Riwayat</h1>
		{dataDestination.map((data, i) => {
			return (
				<div key={i}>
				<div role='button' className={clsx(destinationStyle.item, 'notHighlight')} onClick={() => {
					selectDestination(data)
					onClose()
				}}>
				<label>{data}</label>
				</div>
				</div>
				)
		})}
		</div>
		<button className='btn-second'>Buka Peta</button>
		</div>
		</div>
		</>
		)
}

export default DestinationPopupComponent