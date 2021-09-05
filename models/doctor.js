const mongoose = require("mongoose");
const yup = require("yup");
const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // unique: true,
    autoindex: true,
    required: true,
  },
  mobile: {
    type: String,
    // unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  usertype: {
    type: String,
    default: "Doctor",
  },
  // isOnline:{
  //     type:Number,
  // },
  documentImage: {
    type: String,
    default: null,
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
const validateDoctor = (doctor) => {
  const schema = yup.object().shape({
    name: yup.string().required("Please input your name"),
    email: yup.string().required().email(),
    mobile: yup.string().required(),
    gender: yup.string().required(),
    documentImage: yup.string().required("Plz add image"),
    specialization: yup.string().required(),
    password: yup.string().required(),
  });
  return schema
    .validate(doctor)
    .then((doctor) => doctor)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Doctor = new mongoose.model("Doctor", DoctorSchema);
exports.validateDoctor = validateDoctor;
