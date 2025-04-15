const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bikeRentalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Registration Schema and Model
const registrationSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

// Bike Schema and Model
const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  limit: { type: String, required: true },  // Add the 'limit' field
  seats: { type: String, required: true },  // Add the 'seats' field
  fuel: { type: String, required: true },   // Add the 'fuel' field
});


const Bike = mongoose.model('Bike', bikeSchema);

// Root GET route
app.get('/', (req, res) => {
  res.send('Welcome to the bike rental API');
});

// Registration POST route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new Registration({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
});

// Bike Routes

// GET all bikes
app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bikes', error });
  }
});

// POST a new bike
app.post('/api/bikes', async (req, res) => {
  const { name, price, image, limit, seats, fuel } = req.body; // include the new fields

  if (!name || !price || !image || !limit || !seats || !fuel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newBike = new Bike({ name, price, image, limit, seats, fuel }); // include the new fields
    const savedBike = await newBike.save();
    res.status(201).json(savedBike);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bike', error });
  }
});

// PUT update a bike by ID
app.put('/api/bikes/:id', async (req, res) => {
  const { name, price, image, limit, seats, fuel } = req.body; // include the new fields

  if (!name || !price || !image || !limit || !seats || !fuel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      { name, price, image, limit, seats, fuel }, // include the new fields
      { new: true }
    );
    if (!updatedBike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    res.json(updatedBike);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bike', error });
  }
});


// DELETE a bike by ID
app.delete('/api/bikes/:id', async (req, res) => {
  try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);
    if (!deletedBike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bike', error });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
