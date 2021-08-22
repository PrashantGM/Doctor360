const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const bcrypt = require("bcryptjs");
const { upload } = require("../middlewares/uploads");
const fs = require("fs");
router.post("/register", async (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const age = req.body.age;
  const gender = req.body.gender;
  const bloodGroup = req.body.bloodGroup;
  const password = req.body.password;
  // const profileImg = fs.readFileSync(req.file.path, "base64");
  // fs.unlinkSync(req.file.path);
  bcrypt.hash(password, 10, function (err, hash) {
    var pData = new Patient({
      name: name,
      address: address,
      email: email,
      mobile: mobile,
      gender: gender,
      bloodGroup: bloodGroup,
      age: age,
      password: hash,
    });
    pData
      .save()
      .then(() => {
        res.status(201).json({
          success: "true",
          message: "Patient Successfully Registered",
        });
      })
      .catch((e) => {
        if (e.name === "MongoError" && e.code === 11000 && e.keyPattern.email)
          return res.status(201).json({
            success: "false",
            message: "Error!!!Account with this email already exists",
          });
        if (e.name === "MongoError" && e.code === 11000 && e.keyPattern.mobile)
          return res.status(201).json({
            success: "false",
            message: "Error!!!Duplicate mobile number",
          });
        res.status(201).json({ success: "false", message: e.message });
      });
  });
});
router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  Patient.findOne({ email: email })
    .then((pdata) => {
      if (pdata == null) {
        return res
          .status(201)
          .json({ success: "false", message: "Invalid Credentials!!" });
      }
      bcrypt.compare(password, pdata.password, function (err, result) {
        if (result == false) {
          return res
            .status(201)
            .json({ success: "false", message: "Invalid Credentials" });
        }
        return res.status(201).json({
          success: "true",
          data: pdata,
          message: "Patient Successfully Logged In",
        });
      });
    })
    .catch((e) => {
      res.status(201).json({ success: "false", message: e });
    });
});

//display patient details by id
router.get("/view/:id", async function (req, res) {
  const id = req.params.id;
  const logPatient = await Patient.findOne({ _id: id })
    .then((result) => {
      res.status(201).json({ success: "true", data: result });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});

router.put(
  "/updateprofile/:id",
  upload.single("profileImg"),
  function (req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const age = req.body.age;
    const gender = req.body.gender;
    const bloodGroup = req.body.bloodGroup;
    const pid = req.params.id;
    const profileImg = fs.readFileSync(req.file.path, "base64");

    fs.unlinkSync(req.file.path);
    Patient.updateOne(
      { _id: pid },
      {
        name: name,
        address: address,
        mobile: mobile,
        gender: gender,
        age: age,
        bloodGroup: bloodGroup,
        profileImg: profileImg,
      }
    )
      .then(function (result) {
        res
          .status(201)
          .json({ success: "true", message: `Profile of ${name}  Updated` });
      })
      .catch(function (e) {
        res.status(201).json({ success: "false", message: e });
      });
  }
);

//for password update
router.get("/viewpassword/:id", async function (req, res) {
  const id = req.params.id;
  const logPatient = await Patient.findOne({ _id: id })
    .then((result) => {
      res.status(201).json({ success: "true", data: result.password });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", message: "Error loading results" });
    });
});
router.put("/changepassword/:id", function (req, res) {
  const currrentpassword = req.body.currrentpassword;
  const password = req.body.password;
  const pid = req.params.id;
  Patient.findOne({ _id: pid }).then((pdata) => {
    bcrypt.compare(currrentpassword, pdata.password, function (err, result) {
      if (result == false) {
        return res
          .status(201)
          .json({ success: "false", message: "Incorrect Current Password" });
      }
    });
  });
  console.log("Inbetween now");
  bcrypt.hash(password, 10, function (err, hash) {
    Patient.updateOne({ _id: pid }, { password: hash })
      .then(function (result) {
        res
          .status(201)
          .json({ success: "true", message: "Password Changed Successfully" });
      })
      .catch(function (e) {
        res.status(201).json({ success: "false", message: e });
      });
  });
});
module.exports = router;
