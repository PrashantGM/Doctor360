const mongoose = require("mongoose");

const chatRequestSchema = new mongoose.Schema({
  // patientId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Patient",
  // },
  // doctorId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Doctor",
  // },
  // requestStatus: {
  //   type: Number,
  //   default: 0,
  // },
  // chat: {
  //   message: {
  //     type: String,
  //     default: "",
  //   },
  //   dateTime: {
  //     type: Date,
  //     default: Date.now,
  //   },
  //   sender: {
  //     type: String,
  //   },
  // },
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
  chat: [
    {
      message: {
        type: String,
        default: "",
      },
      dateTime: {
        type: Date,
        default: Date.now,
      },
      sender: {
        type: String,
      },
    },
  ],
  lastMessage: {
    type: String,
    default: "",
  },
});

module.exports = new mongoose.model("ChatRequest", chatRequestSchema);
