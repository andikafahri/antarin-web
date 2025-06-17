import {useState, useEffect, useMemo} from 'react'
import clsx from 'clsx'
import debounce from 'lodash.debounce'
import s from '../styles/components/Select-with-search.module.css'

const SelectWithSearchComponent = ({isLoading, handle, isOpen, data, netral, onSelect, selected}) => {
	const [filter, setFilter] = useState(data)
	const [active, setActive] = useState(selected)

	useEffect(() => {
		if(!isLoading){
			if(selected?.id && data){
				const found = filter?.find(item => item.id === selected.id)
				if(found){
					setActive(found)
				}
				return
			}
			setActive({id: null, name: netral})
		}
	}, [isLoading, data, selected])
	console.log('ACTIVE: '+active?.name+' | DATA: '+filter?.name+' | SELECTED: '+selected?.name)

	// OPTION DROPDOWN
	const List = () => {
		if(isLoading){
			return <li className={s.disabled}>Memuat . . .</li>
		}

		if(filter?.length === 0){
			return <li className={s.disabled}>Kosong</li>
		}

		return filter?.map((item, i) => {
			return (
				<li key={item.id} className={item.id === active?.id ? s.select : ''} onClick={() => handleSelect(item)}>{item.name}</li>
				)
		})
	}

	// SEARCH
	const [search, setSearch] = useState('')
	const debouncedSearch = useMemo(() => 
		debounce((val) => {
			setFilter(data?.filter(item => item?.name?.toLowerCase().includes(search?.toLowerCase())))
		}, 500),
		[search])

	useEffect(() => {
		if(search.trim() === ''){
			setFilter(data)
		}else{
			debouncedSearch(search)
		}
		return () => debouncedSearch.cancel()
	}, [data, search])

	// SELECT OPTION
	const handleSelect = (item) => {
		// setActive(item)
		onSelect(item)
		handle()
	}

	// useEffect(() => {
	// 	if(active?.id){
	// 		onSelect(active)
	// 	}
	// }, [active])
	return (
		<>
		<div className={clsx(s.selectWrapper, 'notHighlight')}>
		<div role='button' className={s.selectInput} onClick={handle}>
		<label>{isLoading ? 'Memuat . . .' : active?.name}</label>
		<i className={clsx('fas fa-chevron-down', isOpen && s.open)}></i>
		</div>
		<div className={clsx(s.selectDropdown, isOpen && s.open)}>
		<input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
		<ul>
		<List />
		</ul>
		</div>
		</div>
		</>
		)
}

export default SelectWithSearchComponent