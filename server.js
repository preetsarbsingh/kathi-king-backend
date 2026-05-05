const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Kathi King Backend Running 🚀');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const User = require('./models/User');

// SIGNUP API
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create new user
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // check password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        orders: user.orders
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});