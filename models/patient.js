const mongoose = require("mongoose");
const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  usertype: {
    type: String,
    default: "Patient",
  },
  password: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    default: null,
  },
});

module.exports = new mongoose.model("Patient", PatientSchema);
