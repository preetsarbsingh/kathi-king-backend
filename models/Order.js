const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

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
      qty:Number,
      price:Number
    }
  ],

  total:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    default:'Pending'
  }

},{
  timestamps:true
});

module.exports = mongoose.model('Order', OrderSchema);