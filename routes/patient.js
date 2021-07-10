const express=require('express');
const router=express.Router();
const Patient=require('../models/patient');

router.post("/registerpatient",(req,res)=>{
    
    console.log(req.body);
    var pData=new Patient(req.body);
    pData.save().then(()=>{
        res.send("Patient Registered");
    })
    
})
router.get("/loginpatient",function(req,res){
    Patient.find().then(function(data){
      // console.log(data[2])
        res.send(data);
    })
})
module.exports=router