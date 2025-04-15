const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for vehicles
const vehicles = [
  { id: 1, name: 'Bike 1', type: 'Bike', price: 15 },
  { id: 2, name: 'Bike 2', type: 'Bike', price: 18 },
  { id: 3, name: 'Car 1', type: 'Car', price: 50 },
  { id: 4, name: 'Car 2', type: 'Car', price: 60 },
];

// API to fetch vehicles
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});


app.post("/create", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  try {
    // Create a new user document
    const newUser = new User({
      username,
      email,
      password,
      confirmPassword
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
