require("dotenv").config()
const express = require("express")
const Razorpay = require("razorpay")
const uuidv4 = require("uuid").v4
const crypto = require("crypto")
const Payments = require("../models/paymentSchema")

const router = express.Router()

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEYID,
      key_secret: process.env.RAZORPAY_SECRETKEY,
    })

    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${uuidv4().slice(0, 8)}`,
    }

    const order = await instance.orders.create(options)

    if (!order) return res.status(500).send("Some error occured")

    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      user,
      email,
      phone,
      fromDate,
      toDate,
      amount,
    } = req.body
    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRETKEY)

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`)

    const digest = shasum.digest("hex")

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" })

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    // Store in mongodb database. name , email, phone, razerorderid, razerpaymentid

    const payment = new Payments({
      name: user,
      email: email,
      phoneNumber: phone,
      from: fromDate,
      to: toDate,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      amount: amount / 100,
    })
    await payment.save()

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
