import React, { Component } from "react";
import AddressForm from "../AddressForm";
import "./index.css";

class CustomerForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    successMsg: "",
    addresses: [],
    showAddressForm: false,
    customerId: this.props.customerId || null,
    errorMsg: "",
  };

  componentDidMount = () => {
    const { customerId } = this.state;
    if (customerId) {
      // Fetch customer details
      fetch(`http://localhost:5000/api/customers/${customerId}`)
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
          })
        )
        .catch((err) => console.error(err));

      // Fetch addresses
      fetch(`http://localhost:5000/api/customers/${customerId}/addresses`)
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            addresses: data.map((a) => ({
              street: a.address_details,
              city: a.city,
              state: a.state,
              zip: a.pin_code,
              id: a.id,
            })),
          })
        )
        .catch((err) => console.error(err));
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleAddAddressClick = () => {
    if (!this.state.customerId) {
      alert("Please save customer details first!");
      return;
    }
    this.setState({ showAddressForm: true });
  };

  handleAddressSave = (newAddress) => {
    this.setState((prev) => ({
      addresses: [...prev.addresses, newAddress],
      showAddressForm: false,
    }));
  };

  handleAddressCancel = () => {
    this.setState({ showAddressForm: false });
  };

  onClickSubmit = async (event) => {
    event.preventDefault();
    const { customerId, firstName, lastName, phoneNumber, addresses } = this.state;

    try {
      // Save customer
      const method = customerId ? "PUT" : "POST";
      const url = customerId
        ? `http://localhost:5000/api/customers/${customerId}`
        : "http://localhost:5000/api/customers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phoneNumber }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save customer");
      }

      const savedCustomer = await res.json();
      const finalCustomerId = customerId || savedCustomer.id;

      this.setState({ customerId: finalCustomerId });

      // Save addresses
      for (let addr of addresses) {
        if (!addr.id) {
          const addrRes = await fetch("http://localhost:5000/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...addr, customerId: finalCustomerId }),
          });
          if (!addrRes.ok) {
            const errData = await addrRes.json();
            console.error("Failed to save address:", errData);
          }
        }
      }

      this.setState({
        successMsg: customerId
          ? "Customer updated successfully!"
          : "Customer created successfully!",
        errorMsg: "",
      });

      setTimeout(() => this.setState({ successMsg: "" }), 3000);
    } catch (err) {
      console.error(err);
      this.setState({ errorMsg: err.message });
      console.log(err)
    }
  };

  render() {
    const {
      firstName,
      lastName,
      phoneNumber,
      successMsg,
      addresses,
      showAddressForm,
      errorMsg,
    } = this.state;

    return (
      <>
        <form className="form-bg-container" onSubmit={this.onClickSubmit}>
          <label className="label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            className="input"
            onChange={this.handleChange}
            placeholder="Enter Your First Name"
            required
          />

          <label className="label">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            className="input"
            onChange={this.handleChange}
            placeholder="Enter Your Last Name"
            required
          />

          <label className="label">Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            className="input"
            onChange={this.handleChange}
            placeholder="Enter Your Phone Number"
            required
          />
          <button type="submit" className="form-button">
            {this.state.customerId ? "Update" : "Create"}
          </button>

          <div className="customer-address-form" style={{ marginTop: "20px" }}>
            <h3 className="customer-address-form-heading">Addresses</h3>
            {addresses.length === 0 && <p className="label">No addresses added yet.</p>}
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="addresses"
              >
                {addr.street}, {addr.city}, {addr.state}, {addr.zip}
              </div>
            ))}
          </div>
        </form>
        {showAddressForm ? (
              <AddressForm
                customerId={this.state.customerId}
                onSave={this.handleAddressSave}
                onCancel={this.handleAddressCancel}
              />
            ) : (
              <button className="form-button" type="button" onClick={this.handleAddAddressClick}>
                Add Address
              </button>
            )}
        {successMsg && <div className="success-popup">{successMsg}</div>}
        {errorMsg && <div className="error-popup">{errorMsg}</div>}
      </>
    );
  }
}

export default CustomerForm;
