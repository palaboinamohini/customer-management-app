// CustomerDetailPage.js
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import AddressList from "../../Components/AddressList";
import "./index.css";

const CustomerDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="customer-details-bg-main-container">
        <Header />
        <div className="customer-details-bg-container">
          <p>No customer selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-details-bg-main-container">
      <Header />
      <div className="customer-details-bg-container">
        <AddressList customerId={id} />
      </div>
    </div>
  );
};

export default CustomerDetailPage;
