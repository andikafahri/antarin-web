import './App.css';
import {
  getMerchantList
} from './api.jsx'
import {useEffect, useState} from 'react'

const App = () => {
  const [merchantList, setMerchantList] = useState([])

  useEffect(() => {
    // setMerchantList(getMerchantList())
    getMerchantList().then((result) => {
      setMerchantList(result)
    })
  }, [])

  const MerchantList = () => {
    return merchantList.map((merchant, i) => {
      return (
        <a href="merchant.html" className="card" key={i}>
        <div className="cover">
        <img src="/img/1.jpg" />
        </div>
        <div className="info-merchant">
        <h2>{merchant.name}</h2>
        <h3>{merchant.address} | 2 km</h3>
        <div className="rating">
        <div className="star">
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="far fa-star"></i>
        </div>
        <h3 className="count">(100)</h3>
        </div>
        </div>
        </a>
        )
    })
  }

  return (
    <div>
    <div className="header">
    <div className="logo">
    <img src='/img/Logo Antarin.png' />
    </div>
    <div className="address">
    <label className="label">Alamat</label>
    <label className="address-name">Ngebruk</label>
    </div>
    <div className="profile">
    <div className="pict-profile">
    <img src='/img/profile.jpg' />
    </div>
    </div>
    <div className="dropdown-profile hide">
    <span className="name">Andika Fahri</span>
    <div className="action">
    <a href="">Edit Profil</a>
    <a href="">Order</a>
    <a href="">Riwayat</a>
    </div>
    </div>
    </div>

    <div className="info">
    <div className="progress">
    <label>Sedang Diantar</label>
    </div>
    <div className="point">
    <label>Poin</label>
    <p>5000</p>
    </div>
    </div>

    <div className="content">
    <div className="search-bar2">
    <input type="text" name="" placeholder="Cari Di sini" />
    <button type="button" className="btn-search">Cari</button>
    </div>
    <div className="header-content">
    <h1 className="title">Rekomendasi</h1>
    <div className="category">
    <a href="" className="active">Semua</a>
    <a href="">Makanan</a>
    <a href="">Minuman</a>
    </div>
    </div>
    <div className="cards-group">
    <MerchantList />
    </div>


    <div className="header-content">
    <h1 className="title">Terdekat</h1>
    <div className="category">
    <a href="" className="active">Semua</a>
    <a href="">Makanan</a>
    <a href="">Minuman</a>
    </div>
    </div>
    <div className="cards-group">
    <MerchantList />
    </div>
    </div>

    <div className="footer">
    <p>Copyright &copy; 2025 | Developed by NDK. All Rights Reserved.</p>
    </div>
    </div>
    );
}

export default App;
