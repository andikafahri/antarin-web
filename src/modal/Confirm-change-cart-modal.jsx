import {useContext} from 'react'
import clsx from 'clsx'
import {OrderContext} from '../context/Order-context.jsx'
import confirmStyle from '../styles/modal/ConfirmChangeCartModal.module.css'

const ConfirmChangeCartModal = ({isOpen, onClose, newItem, onConfirm}) => {
	const {setCartItems, addToCart} = useContext(OrderContext)
	const handleConfirm = () => {
		setCartItems([])
		addToCart(newItem)
		onClose()
		onConfirm()
	}

	return (
		<>
		<div className={clsx(confirmStyle.modal, isOpen && confirmStyle.open)}>
		<div className={confirmStyle.box}>
		<div className={confirmStyle.icon}>
		<span className='fa-solid fa-exclamation-circle'></span>
		</div>
		<div className={confirmStyle.info}>
		<p>Dengan menambahkan item dari merchant ini, item yang sudah kamu tambahkan dari merchant sebelumnya akan dihapus. Apakah kamu yakin?</p>
		</div>
		<div className={confirmStyle.btnGroup}>
		<button className='btn-second' onClick={onClose}>BATAL</button>
		<button className='btn-primary' onClick={handleConfirm}>HAPUS</button>
		</div>
		</div>
		</div>
		</>
		)
}

export default ConfirmChangeCartModal