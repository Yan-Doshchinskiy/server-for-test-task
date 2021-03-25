const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length

const isDev = process.env.NODE_ENV !== "production"
const PORT = process.env.PORT || 5000

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

  app.get("/", (req, res) => {
    res.end(`
      <div>adsfsdfasd</div>
    `)
  })

  app.get("/users", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../server", "resp.json"))
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

  const UsersSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      default: "NoName",
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
    },
    car: {
      type: String,
    },
    role: {
      type: [String],
      default: ["user"],
    },
  })

  const Phone = mongoose.model("phones", PhonesSchema)
  const User = mongoose.model("users", UsersSchema)

  app.get("/api/v1/getphones", (req, res) => {
    const phoneDB = Phone.find({}).exec()
    setTimeout(() => {
      phoneDB.then((it) => res.send(it))
    }, 0)
  })

  app.get("/api/v1/getphones/filterByName", (req, res) => {
    const phoneDB = Phone.find({}).exec()
    setTimeout(() => {
      phoneDB.then((it) => {
        let result
        it.map((item) => {
          if (item.name === req.body.name) {
            result = { name: item.name, phone: item.phone }
          }
        })
        res.send(result || "not found")
      })
    }, 0)
  })

  app.get("/api/v1/getphones/filterByPhone", (req, res) => {
    const phoneDB = Phone.find({}).exec()
    setTimeout(() => {
      phoneDB.then((it) => {
        let result
        it.map((item) => {
          if (item.phone === req.body.phone) {
            result = { name: item.name, phone: item.phone }
          }
        })
        res.send(result || "not found")
      })
    }, 0)
  })

  app.get("/api/v1/getusers", (req, res) => {
    const usersDB = User.find({}).exec()
    usersDB.then((it) => res.send(it))
  })

  app.post("/api/v1/getphones/*", (req, res) => {
    Phone.create({ ...req.body })
      .then(() => res.send({ status: "succesfull", name: req.body.name }))
      .catch((err) => res.send({ status: "error" }))
  })

  app.delete("/api/v1/getphones/*", (req, res) => {
    Phone.deleteMany({ name: req.body.name })
      .then(() => res.send({ status: "deleted", name: req.body.name }))
      .catch((err) => res.send({ status: "error" }))
  })

  // app.get("/api/v1/getusers/new", (req, res) => {
  //   User.create(
  //     {
  //       name: "hah2",
  //       age: 28,
  //       email: "hah2@gmail.com",
  //       car: "Nissan",
  //       role: ["support"],
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err)
  //       }
  //     }
  //   )
  //   usersDB.then((it) => res.send(it))
  // })

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    )
  })
}
