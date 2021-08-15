const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const { Doctor } = require("../models/doctor");
const Patient = require("../models/patient");
//Creates admin directly from static code below
router.post("/register", (req, res) => {
  const name = "Ashmin KC";
  const email = "admin@gmail.com";
  const password = "admin@123";

  bcrypt.hash(password, 10, (err, hash) => {
    var dData = new Admin({ name: name, email: email, password: hash });
    dData
      .save()
      .then(() => {
        res
          .status(201)
          .json({ success: "true", message: `Admin ${name} created` });
      })
      .catch((e) => {
        res
          .status(201)
          .json({ success: "false", message: "Unsuccessful Registration" });
      });
  });
});
router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  Admin.findOne({ email: email })
    .then((data) => {
      if (data == null) {
        return res
          .status(201)
          .json({ success: "false", message: "Invalid Credentials!!" });
      }
      bcrypt.compare(password, data.password, function (err, result) {
        if (result == false) {
          return res
            .status(201)
            .json({ success: "false", message: "Invalid Credentials" });
        }
        return res.status(201).json({
          success: "true",
          message: "Successfully logged into admin panel",
        });
      });
    })
    .catch((e) => {
      res.status(201).json({ success: "false", message: e });
    });
});
//direct use of doctor router module for admin route to be tried later

//for now
//to get list of doctors and also check for verification
router.get("/doctors/view", async function (req, res) {
  const logDoctor = await Doctor.find()
    .then((result) => {
      res.status(201).json({ success: "true", data: result });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});
router.get("/doctors/view/pending", async function (req, res) {
  const logDoctor = await Doctor.find({ status: 0 })
    .then((result) => {
      res.status(201).json({ success: "true", data: result });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});
router.get("/doctors/view/verified", async function (req, res) {
  const logDoctor = await Doctor.find({ status: 1 })
    .then((result) => {
      res.status(201).json({ success: "true", data: result });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});
//for verifying the registration requests from doctors
router.put("/doctors/update/:id", function (req, res) {
  const did = req.params.id;

  Doctor.updateOne({ _id: did }, { status: 1 })
    .then(function (result) {
      res
        .status(201)
        .json({ success: "true", message: "Doctor Verfied Successfully" });
    })
    .catch(function (e) {
      res.status(201).json({
        success: "false",
        message: "Error! Verification Unsuccessful",
      });
    });
});
router.get("/patients/view", async function (req, res) {
  const logDoctor = await Patient.find()
    .then((result) => {
      res.status(201).json({ success: "true", data: result });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});

router.delete("/doctors/reject/:id", function (req, res) {
  const did = req.params.id;
  Doctor.deleteOne({ _id: did })
    .then(function (result) {
      res.status(201).json({ message: "Rejected and Deleted from system" });
    })
    .catch(function (err) {
      res.status(201).json({ message: err });
    });
});
router.delete("/doctors/deleteall", (req, res) => {
  Doctor.deleteMany({}).then(() => {
    res.status(200).json({ message: "Successfully deleted all doctors" });
  });
});

module.exports = router;
