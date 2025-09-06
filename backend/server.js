const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB vehicleRentalDB
mongoose.connect("mongodb://localhost:27017/vehicleRentalDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected to vehicleRentalDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// ✅ Bike Schema and Model (store in separate "bikes" collection)
const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  limit: { type: String, required: true },
  seats: { type: Number, required: true },
  fuel: { type: String, required: true }
}, { collection: "bikes" });  // store bikes separately

const Bike = mongoose.model('Bike', bikeSchema);

// ---------------------- Bike Routes ----------------------
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

// ---------------------- Car Schema & Routes ----------------------
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  limit: { type: String, required: true },
  seats: { type: Number, required: true },
  fuel: { type: String, required: true },
  transmission: { type: String, required: true },
  type: { type: String, required: true },
  ac: { type: Boolean, required: true }
}, { collection: "cars", timestamps: true }); // store cars separately

const Car = mongoose.model('Car', carSchema);

// Car Routes
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const { name, price, image, limit, seats, fuel, transmission, type, ac } = req.body;
    
    if (!name || !price || !image || !limit || !seats || !fuel || !transmission || !type || ac === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCar = new Car({
      name,
      price: Number(price),
      image,
      limit,
      seats: Number(seats),
      fuel,
      transmission,
      type,
      ac
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error: error.message });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating car', error: error.message });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
});

// ---------------------- Start Server ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
