const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bikeRentalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Bike Schema and Model
const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  limit: { type: String, required: true },
  seats: { type: Number, required: true },
  fuel: { type: String, required: true }
});

const Bike = mongoose.model('Bike', bikeSchema);

// API Routes
app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bikes', error });
  }
});

app.post('/api/bikes', async (req, res) => {
  const { name, price, image, limit, seats, fuel } = req.body;

  if (!name || !price || !image || !limit || !seats || !fuel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newBike = new Bike({ name, price, image, limit, seats, fuel });
    const savedBike = await newBike.save();
    res.status(201).json(savedBike);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bike', error });
  }
});

app.put('/api/bikes/:id', async (req, res) => {
  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});