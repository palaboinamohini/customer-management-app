import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { MdDelete } from "react-icons/md"
import axios from 'axios';
import './index.css'

const CustomerList = ({ searchTerm }) => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/customers')
            .then(response => {
                console.log("API response:", response.data);
                setCustomers(response.data.data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }, []);

    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || data.message);
                return;
            }

            alert(data.message);

            setCustomers(customers.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error deleting customer:", err);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone_number.includes(searchTerm)
    );

    return (
        <div className='customer-table-bg-container'>
            <h1 className='customer-table-heading'>Customers List</h1>
            <table className='customer-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(eachCustomer => (
                            <tr key={eachCustomer.id}>
                                <td>{eachCustomer.id}</td>
                                <td>{eachCustomer.first_name}</td>
                                <td>{eachCustomer.last_name}</td>
                                <td>{eachCustomer.phone_number}</td>
                                <td>
                                    <Link to={`/customers/${eachCustomer.id}`} className='link'>
                                        <button className='form-btn'>Address</button>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/customers/${eachCustomer.id}/edit`} className='link'>
                                        <button className='form-btn'>Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteCustomer(eachCustomer.id)}
                                    >
                                        <MdDelete size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;
