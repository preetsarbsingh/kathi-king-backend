const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


// ================= MONGODB =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));


// ================= MODELS =================

const User = require('./models/User');
const Order = require('./models/Order');


// ================= TEST ROUTE =================

app.get('/', (req, res) => {
  res.send("Kathi King Backend Running 🚀");
});


// ================= SIGNUP =================

app.post('/signup', async (req, res) => {

  try {

    console.log("Signup request:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    res.json({
      success: true,
      message: "Signup successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {

    console.log("Signup Error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// ================= LOGIN =================

app.post('/login', async (req, res) => {

  try {

    console.log("Login request:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        orders: user.orders || 0
      }
    });

  } catch (err) {

    console.log("Login Error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// ================= CREATE ORDER =================

app.post('/create-order', async (req, res) => {

  try {

    console.log("Create Order:", req.body);

    const {
      userEmail,
      userName,
      items,
      total
    } = req.body;

    if (
      !userEmail ||
      !items ||
      !items.length ||
      !total
    ) {

      return res.status(400).json({
        message: "Invalid order data"
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
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {

    console.log("Create Order Error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// ================= GET ALL ORDERS =================
app.get('/orders', async (req,res)=>{

  try{

    const orders = await Order.find().sort({createdAt:-1});

    res.json(orders);

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:'Server error'
    });
  }

});


// ================= UPDATE STATUS =================
app.put('/orders/:id', async (req,res)=>{

  try{

    await Order.findByIdAndUpdate(req.params.id,
    {
      status:'Delivered'
    });

    res.json({
      message:'Order delivered successfully'
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:'Server error'
    });

  }

});


// ================= DELETE ORDER =================
app.delete('/orders/:id', async (req,res)=>{

  try{

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message:'Order deleted successfully'
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:'Server error'
    });

  }

});


// ================= START SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});