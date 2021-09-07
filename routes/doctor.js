const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Doctor, validateDoctor } = require("../models/doctor");
const Appointment = require("../models/appointment");
const ChatRequest = require("../models/chatRequest");
// const Image = require("../models/image");
const bcrypt = require("bcryptjs");
const { upload } = require("../middlewares/uploads");

// router.post("/imageupload", (req, res) => {
//   console.log("running");
//   const encodedImage = req.body.documentImage;
//   // console.log(encodeImage);
//   // var imagee = new Image({ img: encodedImage });
//   // imagee.save();
//   console.log(encodedImage);
//   res.send("Success");
// });
router.post(
  "/register",
  // upload.fields([
  //   { name: "documentImage", maxCount: 1 },
  //   { name: "profileImg", maxCount: 1 },
  // ]),
  async (req, res) => {
    const error = await validateDoctor(req.body);
    if (error.message) res.status(400).send(error.message);
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const gender = req.body.gender;
    const specialization = req.body.specialization;
    const qualification = req.body.qualification;
    const password = req.body.password;
    const documentImage = req.body.documentImage;
    //converting images into binary base64 format
    // const documentImage = fs.readFileSync(req.file.path, "base64");
    // const profileImg = fs.readFileSync(
    //   req.files["profileImg"][0].path,
    //   "base64"
    // );
    //Removing temporarily saved files

    // fs.unlinkSync(req.file.path);
    // fs.unlinkSync(req.files["profileImg"][0].path);

    bcrypt.hash(password, 10, (err, hash) => {
      var dData = new Doctor({
        name: name,
        email: email,
        mobile: mobile,
        gender: gender,
        specialization: specialization,
        qualification: qualification,
        documentImage: documentImage,
        password: hash,
      });
      dData
        .save()
        .then(() => {
          res
            .status(201)
            .json({ success: "true", message: "Successfully Registered" });
        })
        .catch((e) => {
          if (e.name === "MongoError" && e.code === 11000 && e.keyPattern.email)
            return res.status(201).json({
              success: "false",
              message: "Error!!!Account with this email already exists",
            });
          if (
            e.name === "MongoError" &&
            e.code === 11000 &&
            e.keyPattern.mobile
          )
            return res.status(201).json({
              success: "false",
              message: "Error!!!Duplicate mobile number",
            });
          res.status(201).json({ success: "false", message: e.message });
        });
    });
  }
);

router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  Doctor.findOne({ email: email })
    .then((data) => {
      console.log(data);
      if (data == null) {
        return res
          .status(201)
          .json({ success: "false", message: "Invalid Credentials!!" });
      }
      bcrypt.compare(password, data.password, function (err, result) {
        console.log(data.password);
        if (result == false) {
          return res.status(201).json({
            success: "false",
            data: data,
            message: "Invalid Credentials",
          });
        }
        return res.status(201).json({
          success: "true",
          data: data,
          message: "Successfully logged in",
        });
      });
    })
    .catch((e) => {
      res
        .status(201)
        .json({ success: "false", data: data, message: e.message });
    });
});

router.get("/viewappointments/requests/:id", async function (req, res) {
  const doctorId = req.params.id;
  const logDoctor = await Appointment.find({
    doctorId: doctorId,
    requestStatus: 0,
  })
    .populate("patientId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});
router.delete("/rejectappointment/:id", function (req, res) {
  const patientId = req.params.id;
  Appointment.deleteOne({ patientId: patientId })
    .then(function (result) {
      res.status(201).json({ message: "Rejected and Deleted from system" });
    })
    .catch(function (err) {
      res.status(201).json({ message: err });
    });
});

router.get("/viewappointments/accepted/:id", async function (req, res) {
  const doctorId = req.params.id;
  const logDoctor = await Appointment.find({
    doctorId: doctorId,
    requestStatus: 1,
  })
    .populate("patientId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.put("/acceptappointments/:id", function (req, res) {
  const patientId = req.params.id;
  Appointment.findOne({ patientId: patientId })
    .then(function (result) {
      if (result == null)
        return res
          .status(201)
          .json({ success: "false", message: "This PatientId doesn't exist" });
      Appointment.updateOne({ patientId: patientId }, { requestStatus: 1 })
        .then(function (result) {
          res
            .status(201)
            .json({ success: "true", message: "Appointment Confirmed" });
        })
        .catch(function (e) {
          res.status(201).json({
            success: "false",
            message: "Error!!!",
          });
        });
    })
    .catch(function (e) {
      res.status(201).json({
        success: "false",
        message: "Error",
      });
    });
});

router.get("/view", async function (req, res) {
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

//display doctor details by id
router.get("/view/:id", async function (req, res) {
  const id = req.params.id;
  const logDoctor = await Doctor.findOne({ _id: id })
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
  // upload.fields([
  //   { name: "documentImage", maxCount: 1 },
  //   { name: "profileImg", maxCount: 1 },
  // ]),
  function (req, res) {
    const mobile = req.body.mobile;
    const name = req.body.name;
    const documentImage = req.body.documentImage;
    const profileImg = req.body.profileImg;
    //converting images into binary base64 format
    // const documentImage = fs.readFileSync(
    //   req.files["documentImage"][0].path,
    //   "base64"
    // );
    // const profileImg = fs.readFileSync(
    //   req.files["profileImg"][0].path,
    //   "base64"
    // );
    //Removing temporarily saved files
    // fs.unlinkSync(req.files["documentImage"][0].path);
    // fs.unlinkSync(req.files["profileImg"][0].path);
    const gender = req.body.gender;
    const specialization = req.body.specialization;
    const qualification = req.body.qualification;
    const did = req.params.id;

    Doctor.updateOne(
      { _id: did },
      {
        mobile: mobile,
        gender: gender,
        documentImage: documentImage,
        profileImg: profileImg,
        name: name,
        specialization: specialization,
        qualification: qualification,
      }
    )
      .then(function (result) {
        res.status(201).json({
          success: "true",
          message: `Profile Updated Successfully`,
        });
      })
      .catch(function (e) {
        res.status(201).json({ success: "false", message: e });
      });
  }
);

//for password update
router.get("/viewpassword/:id", async function (req, res) {
  const id = req.params.id;
  const logDoctor = await Doctor.findOne({ _id: id })
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
  const did = req.params.id;
  Doctor.findOne({ _id: did }).then((ddata) => {
    bcrypt.compare(currentpassword, ddata.password, function (err, result) {
      if (result == false) {
        return res
          .status(201)
          .json({ success: "false", message: "Incorrect Current Password" });
      } else {
        bcrypt.hash(password, 10, function (err, hash) {
          Doctor.updateOne({ _id: did }, { password: hash })
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

//for chat request
router.get("/viewchats/requests/:id", async function (req, res) {
  const doctorId = req.params.id;
  const logDoctor = await ChatRequest.find({
    doctorId: doctorId,
    requestStatus: 0,
  })
    .populate("patientId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});
router.delete("/rejectchat/:id", function (req, res) {
  const patientId = req.params.id;
  ChatRequest.deleteOne({ patientId: patientId })
    .then(function (result) {
      res.status(201).json({ message: "Rejected and Deleted from system" });
    })
    .catch(function (err) {
      res.status(201).json({ message: err });
    });
});

router.get("/viewchats/accepted/:id", async function (req, res) {
  const doctorId = req.params.id;
  const logDoctor = await ChatRequest.find({
    doctorId: doctorId,
    requestStatus: 1,
  })
    .populate("patientId", ["name", "profileImg"])
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.put("/acceptchat/:id", function (req, res) {
  const patientId = req.params.id;
  ChatRequest.findOne({ patientId: patientId })
    .then(function (result) {
      if (result == null)
        return res
          .status(201)
          .json({ success: "false", message: "This PatientId doesn't exist" });
      ChatRequest.updateOne({ patientId: patientId }, { requestStatus: 1 })
        .then(function (result) {
          res.status(201).json({ success: "true", message: "Chat Accepted" });
        })
        .catch(function (e) {
          res.status(201).json({
            success: "false",
            message: "Error!!!",
          });
        });
    })
    .catch(function (e) {
      res.status(201).json({
        success: "false",
        message: "Error",
      });
    });
});

module.exports = router;
