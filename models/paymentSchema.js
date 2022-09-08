const mongoose = require("mongoose")

const Payments = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  orderId: { type: String },
  paymentId: { type: String },
  from: { type: String },
  to: { type: String },
  amount: { type: Number },
})

module.exports = mongoose.model("Payments", Payments)
