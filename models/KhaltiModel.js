const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

// Define a schema for the payment data
const paymentSchema = new mongoose.Schema({
  amount: Number,
  idx: String,
  mobile: String,
  product_identity: String,
  product_name: String,
  product_url: String,
  token: String,
  widget_id: String,
  
});

// Create a model for the payment data
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;