const express=require('express');
const router=express.Router();
const Doctor=require('../models/doctor');

router.post("/register",(req,res)=>{
    
  var dData=new Doctor(req.body);
  dData.save()
  .then(()=>{
    res.status(201).json({success:true});
  })
  .catch((e)=>{
    res.status(500).json({message:e});
    
  })
})
router.get("/login",function(req,res){
  Doctor.find()
    .then((result)=>{
      res.status(201).json({success:true,data:result});
    })
    .catch((e)=>{
      res.status(500).json({message:e});
    
  })
})
module.exports=router;
