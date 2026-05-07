const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  userEmail:{
    type:String,
    required:true
  },

  userName:{
    type:String,
    required:true
  },

  items:[
    {
      name:String,
      price:Number,
      quantity:Number
    }
  ],

  total:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    default:"Preparing"
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model('Order', orderSchema);