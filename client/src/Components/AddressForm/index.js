import React, { useState, useEffect } from "react";
import "./index.css";

function AddressForm({ customerId, onSave, onCancel, initialData }) {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zip: initialData.zip || "",
      });
    } else {
      // Reset form when adding new
      setForm({ street: "", city: "", state: "", zip: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return alert("Customer ID missing!");

    if (!form.street || !form.city || !form.state || !form.zip) {
      setError("All fields (Street, City, State, ZIP) are required.");
      return;
    }

    try {
      setLoading(true);

      const url = initialData
        ? `http://localhost:5000/api/addresses/${initialData.id}`
        : "http://localhost:5000/api/addresses";

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          address_details: form.street,
          city: form.city,
          state: form.state,
          pin_code: form.zip,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save address");
      }

      const savedAddress = await res.json();
      if (onSave) onSave(savedAddress);

      setError("");

      if (!initialData) {
        setForm({ street: "", city: "", state: "", zip: "" });
      }

      if (onCancel) onCancel();

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="address-heading">
        {initialData ? "Edit Address" : "Add New Address"}
      </h4>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="address-form-bg-container">
        <label className="address-label">
          Street <span style={{ color: "red" }}>*</span>:
        </label>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Enter Street"
          className="address-input"
          required
        />

        <label className="address-label">
          City <span style={{ color: "red" }}>*</span>:
        </label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Enter City"
          className="address-input"
          required
        />

        <label className="address-label">
          State <span style={{ color: "red" }}>*</span>:
        </label>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="Enter State"
          className="address-input"
          required
        />

        <label className="address-label">
          ZIP <span style={{ color: "red" }}>*</span>:
        </label>
        <input
          name="zip"
          type="text"
          value={form.zip}
          onChange={handleChange}
          placeholder="Enter ZIP"
          className="address-input"
          required
        />

        <div className="btn-container">
          <button
            type="submit"
            className="address-form-button"
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Update" : "Add"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="address-form-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default AddressForm;
