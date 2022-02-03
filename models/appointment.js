const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  requestStatus: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: null,
  },
  date: {
    type: String,
    required: [true, "Please add date"],
  },
  time: {
    type: String,
    required: [true, "Please add time"],
  },
});

module.exports = new mongoose.model("Appointment", appointmentSchema);
