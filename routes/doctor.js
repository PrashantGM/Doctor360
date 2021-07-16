const express=require('express');
const router=express.Router();
const {Doctor,validateDoctor}=require('../models/doctor');

router.post("/register",async (req,res)=>{
  const error= await validateDoctor(req.body);
  if(error.message) res.status(400).send(error.message);
  var dData=new Doctor(req.body);
  dData.save()
  .then(()=>{
    res.status(201).json({success:true});
  })
  .catch((e)=>{ 
    res.status(500).json({message:e});
  })
})
router.post("/login",async function(req,res){
  const logDoctor= await Doctor.find()
    .then((result)=>{
      res.status(201).json({success:true,data:result});
    })
    .catch((e)=>{
      res.status(500).json({message:e});
  })
})
router.get("/view",async function(req,res){
  const logDoctor= await Doctor.find()
    .then((result)=>{
      res.status(201).json({success:true,data:result});
    })
    .catch((e)=>{
      res.status(500).json({message:e});
  })
})
module.exports=router;
