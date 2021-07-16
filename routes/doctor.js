const express=require('express');
const router=express.Router();
const Doctor=require('../models/doctor');

router.post("/doctor/register",(req,res)=>{
    
  var dData=new Doctor(req.body);
  dData.save().then(()=>{
    res.send("Doctor Registered");
})

  
})
router.get("/doctor/login",function(req,res){
  Doctor.find().then(function(data){
    // console.log(data[2])
      res.send(data);
  })
})
module.exports=router;
