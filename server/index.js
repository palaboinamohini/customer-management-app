const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

//  Customers

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Get customer by ID
app.get("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, first_name AS firstName, last_name AS lastName, phone_number AS phoneNumber FROM customers WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching customer:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(row);
  });
});

// Create a new customer
app.post("/api/customers", (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  if (!firstName || !lastName || !phoneNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)";
  db.run(sql, [firstName, lastName, phoneNumber], function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "Phone number already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

    res.json({
      id: this.lastID,
      firstName,
      lastName,
      phoneNumber,
    });
  });
});

// Update existing customer
app.put("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;

  db.get("SELECT id FROM customers WHERE phone_number = ? AND id != ?", [phoneNumber, id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: "Phone number already exists for another customer" });

    const sql =
      "UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?";
    db.run(sql, [firstName, lastName, phoneNumber, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: "Customer not found" });

      res.json({ id, firstName, lastName, phoneNumber });
    });
  });
});

// Get all customers
app.get('/api/customers', (req, res) => {
  const getCustomersQuery = `
    SELECT * FROM customers
  `;
  db.all(getCustomersQuery, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// Delete customer
app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM customers WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res.json({ message: "Customer deleted successfully", id });
    }
  });
});

// Addresses

// Get all addresses for a customer
app.get("/api/customers/:customerId/addresses", (req, res) => {
  db.all(
    "SELECT * FROM addresses WHERE customer_id = ?",
    [req.params.customerId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Add new address
app.post("/api/addresses", (req, res) => {
  const { customer_id, address_details, city, state, pin_code } = req.body;

  if (!customer_id || !address_details || !city || !state || !pin_code) {
    return res.status(400).json({
      error: "customer_id, address_details, city, state, and pin_code are required"
    });
  }

  const sql = `
    INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [customer_id, address_details, city, state, pin_code], function(err) {
    if (err) {
      console.error("Error inserting address:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Fetch and return the newly added row
    db.get("SELECT * FROM addresses WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// Update existing address
app.put("/api/addresses/:id", (req, res) => {
  const { customer_id, address_details, city, state, pin_code } = req.body;

  const sql = `
    UPDATE addresses
    SET customer_id = ?, address_details = ?, city = ?, state = ?, pin_code = ?
    WHERE id = ?
  `;

  db.run(sql, [customer_id, address_details, city, state, pin_code, req.params.id], function(err) {
    if (err) {
      console.error("Error updating address:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Fetch and return the updated row
    db.get("SELECT * FROM addresses WHERE id = ?", [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// Delete address
app.delete("/api/addresses/:id", (req, res) => {
  db.run("DELETE FROM addresses WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Address deleted" });
  });
});

// server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
