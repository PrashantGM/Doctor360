const express=require('express');
const router=express.Router();
const {Doctor,validateDoctor}=require('../models/doctor');
const bcrypt=require('bcryptjs');
router.post("/register", async (req,res)=>{
  const error= await validateDoctor(req.body);
  if(error.message) res.status(400).send(error.message);
  const name=req.body.name;
  const email=req.body.email;
  const mobile=req.body.mobile;
  const gender=req.body.gender;
  const specialization=req.body.specialization;
  const qualification=req.body.qualification;
  const documentImage=req.body.documentImage;
  const password=req.body.password;
  bcrypt.hash(password,10,(err,hash)=>{
    var dData= new Doctor({name:name,email:email,mobile:mobile,gender:gender,specialization:specialization,qualification:qualification,documentImage:documentImage,password:hash});
    dData.save()
    .then(()=>{
      res.status(201).json({success:true,message:"Successfully Registered"});
    })
    .catch((e)=>{ 
      res.status(500).json({message:e});
    })
  })
})
router.post("/login",function(req,res){
  const email=req.body.email;
  const password=req.body.password;
  Doctor.findOne({email:email})
    .then((data)=>{
      console.log(data);
      if(data==null)
      {
        return res.status(403).json({message:"Invalid Credentials!!"})
      }
      bcrypt.compare(password,data.password,function(err,result){
        console.log(data.password);
        if(result==false){
            return res.status(403).json({message:"Invalid Credentials"})
        }
      return res.status(201).json({success:true,data:data,message:"Successfully logged in"}); 
    })
    })
    .catch((e)=>{
      res.status(500).json({e});
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
