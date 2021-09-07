const mongoose = require("mongoose");

const chatRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  requestStatus: {
    type: Number,
    default: 0,
  },
});

module.exports = new mongoose.model("ChatRequest", chatRequestSchema);
