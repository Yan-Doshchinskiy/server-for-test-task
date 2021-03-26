const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length

const isDev = process.env.NODE_ENV !== "production"
const PORT = process.env.PORT || 5000
const cors = require("cors")

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    )
  })
} else {
  const app = express()

  app.use(bodyParser())
  app.use(cors())

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.header(
      "Access-Control-Allow-Methods",
      "DELETE, PUT, UPDATE, HEAD, OPTIONS, GET, POST"
    )
    next()
  })

  app.all("*", function (req, res) {
    res.status(404).json({
      response: "error",
      code: 404,
      error: "Не найден объект или метод!",
    })
  })
  app.options("*", function (req, res, next) {
    res.sendStatus(200)
  })

  const mongoose = require("mongoose")

  const dbUrl =
    "mongodb+srv://testAdmin:1246@cluster1.klgod.mongodb.net/testdb?retryWrites=true&w=majority"

  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Connection error - ", err))

  const PhonesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  })

  const Phone = mongoose.model("phones", PhonesSchema)

  app.get("/api/v1/getphones", cors(), (req, res) => {
    const phoneDB = Phone.find({}).exec()
    setTimeout(() => {
      phoneDB.then((it) => res.send({ status: "successful", data: it }))
    }, 0)
  })

  app.post("/api/v1/getphones/filterByName", cors(), (req, res) => {
    const phoneDB = Phone.find({}).exec()
    setTimeout(() => {
      phoneDB.then((it) => {
        let positive
        it.map((item) => {
          if (item.name.toLowerCase() === req.body.name.toLowerCase()) {
            positive = { status: "successful", data: [item] }
          }
        })
        const negative = { status: "not found" }
        res.send(positive || negative)
      })
    }, 0)
  })

  app.post("/api/v1/getphones/create/", cors(), (req, res) => {
    Phone.create({ ...req.body })
      .then(() => res.send({ status: "succesfull", name: req.body.name }))
      .catch((err) => res.send({ status: "error" }))
  })

  app.delete("/api/v1/getphones/delete", cors(), (req, res) => {
    Phone.deleteMany({ name: req.body.name })
      .then(() => res.send({ status: "deleted", name: req.body.name }))
      .catch((err) => res.send({ status: "error" }))
  })
  app.listen(PORT, cors(), function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    )
  })
}
