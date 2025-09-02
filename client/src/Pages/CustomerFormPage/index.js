import { useParams } from "react-router-dom"
import CustomerForm from '../../Components/CustomerForm'
import Header from '../../Components/Header'
import './index.css'

const CustomerFormPage = () => {
  const { id } = useParams()
  return (
    <div className="customer-form-page-bg-container">
      <Header />
      <div className="customer-form-page-container">
        <h1 className="customer-form-page-heading">{id ? "Edit Customer" : "Add Customer"}</h1>
        <CustomerForm customerId={id} />
      </div>
    </div>
  );
}


export default CustomerFormPage