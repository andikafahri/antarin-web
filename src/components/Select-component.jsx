import {useState, useEffect} from 'react'
import clsx from 'clsx'
import s from '../styles/components/Select.module.css'

const SelectComponent = ({styling = null, stylingValue = null, stylingOptionBox = null, stylingOptionScroll = null, stylingOption = null, defaultValue, handle, isOpen, isLoading, data, selected, onSelect}) => {
	const [active, setActive] = useState(selected)

	useEffect(() => {
		if(!isLoading){
			if(selected?.id){
				selected = selected?.id
			}

			if(selected && data){
				const found = data?.find(item => item.id === selected)
				if(found){
					setActive(found)
				}
				return
			}
			setActive({id: null, name: defaultValue})
		}
	}, [isLoading, data, selected])

	// OPTION DROPDOWN
	const List = () => {
		if(isLoading){
			return <li className={s.disabled}>Memuat . . .</li>
		}

		if(data?.length === 0){
			return <li className={s.disabled}>Kosong</li>
		}

		return data?.map((item, i) => {
			return (
				<li key={item.id} className={item.id === active?.id ? s.select : ''} style={stylingOption} onClick={() => handleSelect(item)}>{item.name}</li>
				)
		})
	}

	const handleSelect = (item) => {
		onSelect(item)
		handle()
	}

	return (
		<>
		<div className={clsx(s.selectWrapper, 'notHighlight')}>
		<div role='button' className={s.selectInput} style={styling} onClick={handle}>
		<label className={s.value} style={stylingValue}>{isLoading ? 'Memuat . . .' : active?.name}</label>
		<i className={clsx('fas fa-chevron-down', isOpen && s.open)}></i>
		</div>
		<div className={clsx(s.selectDropdown, isOpen && s.open)} style={stylingOptionBox}>
		<ul style={stylingOptionScroll}>
		<List />
		</ul>
		</div>
		</div>
		</>
		)
}

export default SelectComponent