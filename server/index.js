const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");
// const { check } = require("express-validator");
// const { body, validationResult } = require("express-validator/check");
// const { sanitizeBody } = require("express-validator/filter");

const generateAccessToken = (id, email) => {
  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, secret);
};

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  app.use(bodyParser());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  const mongoose = require("mongoose");

  const dbUrl =
    "mongodb+srv://testAdmin:1246@cluster1.klgod.mongodb.net/testdb?retryWrites=true&w=majority";

  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Connection error - ", err));

  const PhonesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  });

  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: { type: String, required: false },
  });

  const Phone = mongoose.model("phones", PhonesSchema);
  const User = mongoose.model("users", UserSchema);

  app.get("/api/v1/checkEmail", (req, res) => {
    const usersDB = User.find({}).exec();
    usersDB
      .then((it) => {
        it.find((item) => {
          if (item.email.toLowerCase() === req.query.email.toLowerCase()) {
            res.send({
              status: "successful",
              data: req.query.email,
              message: `${req.query.email} is already registered`,
              registered: true,
            });
          }
        });
        res.send({
          status: "successful",
          data: null,
          message: `${req.query.email} not found in the database`,
          registered: false,
        });
      })
      .catch((err) => res.send({ status: "error", error: err }));
  });

  app.post("/api/v1/register/", (req, res) => {
    if (!req.body.email) {
      res.status(422).json({ status: 400, message: "email was not sent" });
    }
    if (!req.body.password) {
      res.status(422).json({ status: 400, message: "passward was not sent" });
    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    User.create({ email: req.body.email.toLowerCase(), password: hashPassword })
      .then(() =>
        res.send({
          status: "successful",
          email: req.body.email.toLowerCase(),
          message: "registration completed",
        })
      )
      .catch((err) => res.send({ status: "error", error: err }));
  });

  app.post("/api/v1/login", (req, res) => {
    if (!req.body.email) {
      res.send({ status: "error", message: "email was not sent" });
    }
    if (!req.body.password) {
      res.send({ status: "error", message: "password was not sent" });
    }

    User.findOne({ email: req.body.email.toLowerCase() })
      .exec()
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (isValidPassword) {
            const token = generateAccessToken(user._id, user.email);
            User.updateOne(
              { email: req.body.email.toLowerCase() },
              { token: token },
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.send({
              status: "successful",
              message: `you are logged in`,
              token: token,
            });
          } else {
            res.send({
              status: "error",
              message: `invalid password`,
            });
          }
        } else {
          res.send({
            status: "error",
            message: `${req.body.email} not found in the database`,
          });
        }
      })
      .catch((err) => res.send({ status: "error", error: err }));
  });
}
