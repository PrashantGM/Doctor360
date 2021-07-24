const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        autoindex: true,
        required: true

    },
    usertype:{
        type:String,
        default:"Admin"
    },
    password: {
        type: String,
        required: true
    }
})
module.exports=new mongoose.model('Admin',AdminSchema);
