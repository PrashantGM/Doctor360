const mongoose=require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true

}).catch(error=>{
    console.log("Error occurred",error);
})