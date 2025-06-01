import HeaderComponent from '../components/Header-component.jsx'
import Card2Component from '../components/Card2-component.jsx'
import FooterComponent from '../components/Footer-component.jsx'
import {useState, useEffect} from 'react'
import clsx from 'clsx'
import {useParams} from 'react-router-dom'
import {getMenuList} from '../api.jsx'
import merchantStyle from '../styles/pages/Merchant.module.css'

const MerchantPage = () => {
	const {id_merchant} = useParams()
	const [menuList, setMenuList] = useState([])

	useEffect(() => {
		getMenuList(id_merchant).then((result) => {
			setMenuList(result)
		})
	}, [id_merchant])

	const MenuList = () => {
		return menuList.map((menu, i) => {
			return (
				<Card2Component key={i} data={menu} />
				)
		})
	}

	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
	const toggleListOrder = () => {
		setIsCheckoutOpen((x) => !x)
	}

	// MODAL OPERATIONAL TIME
	const [isModalOperationalTimeOpen, setIsModalOperationalTimeOpen] = useState(false)

	const toggleModalOperationalTime = () => {
		setIsModalOperationalTimeOpen((x) => !x)
	}

	useEffect(() => {
		if(isModalOperationalTimeOpen || isCheckoutOpen){
			document.body.classList.add('no-scroll')
		}else{
			document.body.classList.remove('no-scroll')
		}
	}, [isModalOperationalTimeOpen, isCheckoutOpen])

	return(
		<>
		<HeaderComponent />

		<div className={merchantStyle.coverCurrentMerchant}>
		<img src="/img/1.jpg" alt="" />
		<div className={merchantStyle.infoCurrentMerchant}>
		<div className={merchantStyle.left}>
		<h1 className={merchantStyle.nameCurrentMerchant}>Andika Chili Oil</h1>
		<div className={merchantStyle.rating}>
		<div className={merchantStyle.star}>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="fas fa-star"></i>
		<i className="far fa-star"></i>
		</div>
		</div>
		</div>
		<div className={merchantStyle.right}>
		<div role='button' onClick={toggleModalOperationalTime}className={merchantStyle.top}>
		<div className={merchantStyle.text}>
		<span>BUKA</span>
		<h2>Tutup pukul 21.00</h2>
		</div>
		<div className={merchantStyle.icon}>
		<i className="fas fa-info-circle"></i>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<div className={merchantStyle.shippingCost}>
		<span>Ongkir: Rp 5000</span>
		</div>
		</div>
		</div>
		</div>
		</div>

		<div className={merchantStyle.content} style={{paddingTop: '20px'}}>
		<div className={merchantStyle.searchBar2}>
		<input type="text" name="" placeholder="Cari Di sini" />
		<button type="button" className={merchantStyle.btnSearch}>Cari</button>
		</div>
		<div className={merchantStyle.headerContent}>
		<div className={merchantStyle.category}>
		<a href="" className={merchantStyle.active}>Semua</a>
		<a href="">Makanan</a>
		<a href="">Minuman</a>
		</div>
		<h1 className={merchantStyle.title}>Rekomendasi</h1>
		</div>
		<div className={merchantStyle.cardsGroup}>
		<MenuList />
		</div>

		<div className={merchantStyle.headerContent}>
		<h1 className={merchantStyle.title}>Minuman</h1>
		</div>
		<div className={merchantStyle.cardsGroup}>
		<div className={merchantStyle.card}>
		<div className={merchantStyle.cover}>
		<img src="/img/1.jpg" />
		</div>
		<div className={merchantStyle.infoMerchant}>
		<h2>Mi Chili Oil</h2>
		<div className={merchantStyle.price}>
		<h3>10.000</h3>
		</div>
		</div>
		</div>
		</div>
		</div>

		
	{/*<div className={clsx(merchantStyle.checkout, merchantStyle.open)}>*/}
		<div className={clsx(merchantStyle.checkout, isCheckoutOpen && merchantStyle.open)}>
		<div className={merchantStyle.listItem}>
		<div className={merchantStyle.itemGroup}>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.item}>
		<div className={merchantStyle.picture}>
		<img src="/img/1.jpg" alt="" />
		</div>
		<div className={merchantStyle.infoItem}>
		<div className={merchantStyle.top}>
		<div className={merchantStyle.left}>
		<h3>Mi Chili Oil</h3>
		<h4>Level 1</h4>
		</div>
		<div className={merchantStyle.right}>
		<h4>x2</h4>
		</div>
		</div>
		<div className={merchantStyle.bottom}>
		<label htmlFor="">22.000</label>
		</div>
		</div>
		</div>
		<div className={merchantStyle.itemSystem}>
		<div className={merchantStyle.shippingCostItem}>
		<h3>Ongkos kirim</h3>
		<h4>5.000</h4>
		</div>
		<div className={merchantStyle.serviceCost}>
		<h3>Biaya layanan</h3>
		<h4>1.000</h4>
		</div>
		</div>
		</div>
		</div>
		<div className={merchantStyle.final}>
		<div role='button' tabIndex='0' onClick={toggleListOrder} className={merchantStyle.totalPrice}>
		<div className={merchantStyle.text}>
		<label htmlFor="">Total <span>(2 item)</span></label>
		<h1>Rp 27.000</h1>
		</div>
		<div className={merchantStyle.icon}>
		<i className="fas fa-chevron-up"></i>
						{/*<i className="fas fa-angle-down"></i>*/}
		</div>
		</div>
		<div className={merchantStyle.btnOrder}>
		<button className="btn-primary">PESAN</button>
		</div>
		</div>
		</div>

		<div role='button' className={clsx(merchantStyle.checkoutContainer, isCheckoutOpen && merchantStyle.open)} onClick={(e) => {
			if(e.target === e.currentTarget){setIsCheckoutOpen(false)}
		}}>
	</div>

	<FooterComponent />

	<div role='button' className={clsx(merchantStyle.modal, isModalOperationalTimeOpen && merchantStyle.open)} onClick={(e) => {
		if(e.target === e.currentTarget){setIsModalOperationalTimeOpen(false)
	}
}}>

<div className={merchantStyle.modalOperationalTime}>
<button className={merchantStyle.btnClose} onClick={() => setIsModalOperationalTimeOpen(false)}><i className="fas fa-close"></i></button>
<h2>Jam Buka</h2>
<div className={merchantStyle.containerListTime}>
<div className={merchantStyle.listTime}>
<span>
<h3>Senin</h3>
<h3>08.00 - 21.00</h3>
</span>
<span className={merchantStyle.active}>
<h3>Selasa</h3>
<h3>08.00 - 21.00</h3>
</span>
<span>
<h3>Rabu</h3>
<h3>08.00 - 21.00</h3>
</span>
<span>
<h3>Kamis</h3>
<h3>08.00 - 21.00</h3>
</span>
<span>
<h3>Jum'at</h3>
<h3>08.00 - 21.00</h3>
</span>
<span>
<h3>Sabtu</h3>
<h3>08.00 - 21.00</h3>
</span>
<span>
<h3>Minggu</h3>
<h3>08.00 - 21.00</h3>
</span>
</div>
</div>
</div>
</div>

<div className={clsx(merchantStyle.modal)}>
<div className={merchantStyle.modalDetailMenu}>
<div className={merchantStyle.cover}>
<img src="/img/1.jpg" alt="" />
</div>
<div className={merchantStyle.body}>
<h1>Mi Chili Oil</h1>
<p>Mi dengan bumbu chili oil yang mantap, dilengkapi dengan berbagai toping</p>
<div className={merchantStyle.variant}>
<h2>Level</h2>
<div className={merchantStyle.listVariant}>
<input type="radio" id="level1" hidden />
<label htmlFor="level1" className={merchantStyle.active}>Level 1</label>
<input type="radio" id="level2" hidden />
<label htmlFor="level2">Level 2</label>
<input type="radio" id="level3" hidden />
<label htmlFor="level3">Level 3</label>
</div>
<h2>Level</h2>
<div className={merchantStyle.listVariant}>
<input type="radio" id="level1" hidden />
<label htmlFor="level1">Level 1</label>
<input type="radio" id="level2" hidden />
<label htmlFor="level2">Level 2</label>
<input type="radio" id="level3" hidden />
<label htmlFor="level3">Level 3</label>
</div>
</div>
</div>
<div className={merchantStyle.detailOrder}>

</div>
<div className={merchantStyle.footerDetailMenu}>
<div className={merchantStyle.infoPrice}>
<span>
<label htmlFor="">Mi Chili Oil</label>
<h4>10.000</h4>
</span>
<span>
<label htmlFor="">Level 3</label>
<h4>1.000</h4>
</span>
<span>
<label htmlFor="">Jumlah</label>
<h4>2</h4>
</span>
<span className={merchantStyle.total}>
<label htmlFor="">Total Harga : </label>
<h4>Rp 22.000</h4>
</span>
</div>
<div className={merchantStyle.buttonGroup}>
<button className="btn-second">BATAL</button>
<button className="btn-primary">TAMBAH</button>
</div>
</div>
</div>
</div>
</>
)
}

export default MerchantPage