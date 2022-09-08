const mongoose = require("mongoose")
require("dotenv").config()

module.exports = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URL).then((res, err) => {
      console.log("Database connected")
      if (err) return reject(err)
      resolve()
    })
  })
}
