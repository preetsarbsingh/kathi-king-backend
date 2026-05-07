const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors({
  origin: "*", // allow all (safe for now)
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("Mongo Error:", err));

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('Kathi King Backend Running 🚀');
});

// ✅ IMPORT MODEL
const User = require('./models/User');
const Order = require('./models/Order');


// ================== SIGNUP ==================
app.post('/signup', async (req, res) => {
  try {
    console.log("Signup request:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    // ✅ IMPORTANT: return user (frontend needs this)
    res.json({
      message: 'Signup successful',
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log("Signup Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================== LOGIN ==================
app.post('/login', async (req, res) => {
  try {
    console.log("Login request:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        orders: user.orders || 0
      }
    });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// CREATE ORDER
app.post('/create-order', async (req,res)=>{

  try{

    const { userEmail, userName, items, total } = req.body;

    if(!userEmail || !items || !items.length){
      return res.status(400).json({
        message:"Invalid order data"
      });
    }

    const order = new Order({
      userEmail,
      userName,
      items,
      total
    });

    await order.save();

    res.json({
      message:"Order placed successfully",
      order
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:"Server error"
    });

  }

});
// CHECKOUT API
app.post('/checkout', async (req, res) => {

  try {

    const { userEmail, items, total } = req.body;

    console.log("Checkout request:", req.body);

    if (!userEmail || !items || !total) {
      return res.status(400).json({
        message: "Missing checkout data"
      });
    }

    res.json({
      success: true,
      message: "Order placed successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }

});