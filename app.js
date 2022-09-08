const express = require("express")
const cors = require("cors")
const app = express()
const connectToDb = require("./connection")

app.use(cors())
const port = process.env.PORT || 5555

const paymentRouter = require("./routes/payment")

// middlewares
app.use(express.json({ extended: false }))
app.use("/payment", paymentRouter)
app.get("/", (req, res) => {
  res.send("Welcome to Whispering Woods API")
})

connectToDb().then(() =>
  app.listen(port, () => console.log(`Server started on port ${port}`))
)
