import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import AddressForm from "../AddressForm";
import "./index.css";

const AddressList = ({ customerId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch addresses for a customer
  useEffect(() => {
    if (!customerId) return;

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/customers/${customerId}/addresses`
        );
        if (!response.ok) throw new Error("Failed to fetch addresses");

        const data = await response.json();
        const formattedData = data.map((addr) => ({
          id: addr.id,
          customerId: addr.customer_id,
          street: addr.address_details,
          city: addr.city,
          state: addr.state,
          zip: addr.pin_code,
        }));
        setAddresses(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [customerId]);

  // Delete an address
  const onClickDelete = async (addressId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${addressId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Open form for new address
  const handleAddAddress = () => {
    setEditAddress(null);
    setShowForm(true);
  };

  // Save
  const handleSave = (savedAddress) => {
    const formatted = {
      id: savedAddress.id,
      customerId: savedAddress.customer_id,
      street: savedAddress.address_details,
      city: savedAddress.city,
      state: savedAddress.state,
      zip: savedAddress.pin_code,
    };

    if (editAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === formatted.id ? formatted : a))
      );
    } else {
      setAddresses((prev) => [...prev, formatted]);
    }

    setShowForm(false);
    setEditAddress(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditAddress(null);
  };

  // Search filter
  const filteredAddresses = addresses.filter((address) =>
    `${address.street} ${address.city} ${address.state} ${address.zip}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="status">Loading addresses...</p>;
  if (error) return <p className="status">Error: {error}</p>;

  return (
    <div className="customer-table-bg-container">
      <h3 className="customer-table-heading">
        Addresses for Customer {customerId}
      </h3>

      {addresses.length > 0 && (
        <input
          type="text"
          placeholder="Search addresses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      )}

      {addresses.length === 0 && !showForm && (
        <div className="customer-address-form">
          <p className="status no">No addresses available.</p>
          <button className="add-address-button" onClick={handleAddAddress}>
            Add First Address
          </button>
        </div>
      )}

      {addresses.length > 0 && filteredAddresses.length === 0 && (
        <p className="status no">No matching addresses found.</p>
      )}

      {filteredAddresses.length > 0 && (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredAddresses.map((address) => (
              <tr key={address.id}>
                <td>
                  {address.street}, {address.city}, {address.state},{" "}
                  {address.zip}
                </td>
                <td>
                  <button
                    className="form-btn"
                    onClick={() => {
                      setEditAddress(address);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onClickDelete(address.id)}
                    aria-label="Delete address"
                  >
                    <MdDelete size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(showForm || editAddress) && (
        <AddressForm
          customerId={customerId}
          initialData={editAddress}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {addresses.length > 0 && !showForm && !editAddress && (
        <button className="add-address-button" onClick={handleAddAddress}>
          + Add Address
        </button>
      )}
    </div>
  );
};

export default AddressList;
