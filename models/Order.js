const mongoose = require("mongoose");

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

  paymentId:{
    type:String,
    default:""
  },

  status:{
    type:String,
    default:"Placed"
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
  mongoose.model("Order", orderSchema);