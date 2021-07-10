const mongoose=require('mongoose');
const Patient=mongoose.model('Patient',{
    name:{
        type:String,
        required:true

    },
    address:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String
    },
    bloodGroup:{
        type:String,
    },
    password:{
        type:String,
        required:true
    }
})
module.exports=Patient;