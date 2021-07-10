const mongoose=require('mongoose');
const Doctor = mongoose.model('Doctor',{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        autoindex:true,
        required:true
       
    },
    mobile:{
        type:String,
        unique:true,
        required:true
    },

    gender:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    documentImage:{
        type:String,
        default: "no-photo.jpg",
    },  
    password:{
        type:String,
        required:true
    }
})
module.exports=Doctor;