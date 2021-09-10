const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const ChatRequest = require("../models/chatRequest");
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
router.post("/appointment", async (req, res) => {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const description = req.body.description;
  const datee = req.body.date;
  const time = req.body.time;
  var apnt = new Appointment({
    patientId: patientId,
    doctorId: doctorId,
    date: datee,
    time: time,
    description: description,
  });

  apnt
    .save()
    .then(() => {
      res.status(201).json({
        success: "true",
        message: "Appointment Request Sent",
      });
    })
    .catch((e) => {
      res.status(201).json({
        success: "false",
        message: e,
      });
    });
});

//Chat
router.post("/chat/:appointmentId", async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const message = req.body.message;
  const senderDoctorId = req.body.senderDoctorId;
  const senderPatientId = req.body.senderPatientId;
  if (senderDoctorId == undefined) {
    var conv = new Conversation({
      appointmentId: appointmentId,
      message: message,
      senderPatientId: senderPatientId,
    });
  } else {
    var conv = new Conversation({
      appointmentId: appointmentId,
      message: message,
      senderDoctorId: senderDoctorId,
    });
  }

  conv
    .save()
    .then(() => {
      res.status(201).json({
        success: "true",
        message: "Message send successfully",
      });
    })
    .catch((e) => {
      res.status(201).json({
        success: "false",
        message: e,
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

router.get("/viewappointments/requests/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await Appointment.find({
    patientId: patientId,
    requestStatus: 0,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.get("/viewappointments/accepted/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await Appointment.find({
    patientId: patientId,
    requestStatus: 1,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
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

router.put("/updateprofile/:id", function (req, res) {
  const name = req.body.name;
  const address = req.body.address;
  const mobile = req.body.mobile;
  const age = req.body.age;
  const gender = req.body.gender;
  const bloodGroup = req.body.bloodGroup;
  const pid = req.params.id;
  const profileImg = req.body.profileImg;
  // const profileImg = fs.readFileSync(req.file.path, "base64");

  // fs.unlinkSync(req.file.path);
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
        .json({ success: "true", message: `Profile Updated Successfully` });
    })
    .catch(function (e) {
      res.status(201).json({ success: "false", message: e });
    });
});

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
  const currentpassword = req.body.currentpassword;
  const password = req.body.password;
  const pid = req.params.id;
  Patient.findOne({ _id: pid }).then((pdata) => {
    bcrypt.compare(currentpassword, pdata.password, function (err, result) {
      if (result == false) {
        return res
          .status(201)
          .json({ success: "false", message: "Incorrect Current Password" });
      } else {
        bcrypt.hash(password, 10, function (err, hash) {
          Patient.updateOne({ _id: pid }, { password: hash })
            .then(function (result) {
              res.status(201).json({
                success: "true",
                message: "Password Changed Successfully",
              });
            })
            .catch(function (e) {
              res.status(201).json({ success: "false", message: e });
            });
        });
      }
    });
  });
});

//Chat request
router.post("/chatrequest", async (req, res) => {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;

  var chRq = new ChatRequest({
    patientId: patientId,
    doctorId: doctorId,
  });
  chRq
    .save()
    .then(() => {
      res.status(201).json({
        success: "true",
        message: "Chat Request Sent",
      });
    })
    .catch((e) => {
      res.status(201).json({
        success: "false",
        message: e,
      });
    });
});

router.get("/viewchats/requests/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await ChatRequest.find({
    patientId: patientId,
    requestStatus: 0,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.get("/viewchats/accepted/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await ChatRequest.find({
    patientId: patientId,
    requestStatus: 1,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.post("/sendmessage", async (req, res) => {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const message = req.body.message;

  ChatRequest.findOneAndUpdate(
    {
      patientId: patientId,
      doctorId: doctorId,
    },
    {
      lastMessage: message,
      $push: { chat: { message: message, sender: "Patient" } },
    }
  )
    .then(() => {
      res.status(201).json({
        success: "true",
        message: "Message Sent",
      });
    })
    .catch((e) => {
      res.status(201).json({
        success: "false",
        message: e,
      });
    });
});

router.get("/viewchat", async function (req, res) {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const logDoctor = await ChatRequest.find({
    patientId: patientId,
    doctorId: doctorId,
    requestStatus: 1,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});
router.get("/chatroom/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await ChatRequest.find({
    patientId: patientId,
    requestStatus: 1,
  })
    .populate("doctorId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

module.exports = router;
