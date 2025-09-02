import { useState } from 'react'
import CustomerList from '../../Components/CustomerList'
import Header from '../../Components/Header'
import './index.css'

const CustomerListPage = () => {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className='home-bg-main-container'>
            <Header />
            <div className="home-bg-container">
                <h1 className='home-main-heading'>CUSTOMER MANAGEMENT</h1>
                <input
                    type="search"
                    placeholder="Search by first name, last name, or phone number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <CustomerList searchTerm={searchTerm} />
            </div>
        </div>
    )
}

export default CustomerListPage
