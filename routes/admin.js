const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const Admin=require('../models/admin');
 const Doctor=require('../models/doctor');

router.post("/register",(req,res)=>{
    const name="Ashmin KC";
    const email="admin@gmail.com";
    const password="admin@123";

    bcrypt.hash(password,10,(err,hash)=>{
    var dData= new Admin({name:name,email:email,password:hash});
    dData.save()
    .then(()=>{
      res.status(201).json({success:true,message:`Admin ${name} created`});
    })
    .catch((e)=>{ 
      res.status(500).json({message:e});
    })
  })
})
router.post("/login",function(req,res){
  const email=req.body.email;
  const password=req.body.password;
  Admin.findOne({email:email})
    .then((data)=>{
      console.log(data);
      if(data==null)
      {
        return res.status(403).json({message:"Invalid Credentials!!"})
      }
      bcrypt.compare(password,data.password,function(err,result){
        if(result==false){
            return res.status(403).json({message:"Invalid Credentials"})
        }
      return res.status(201).json({success:true,message:"Successfully logged into admin panel"}); 
    })
    })
    .catch((e)=>{
      res.status(500).json({e});
  })
})
//direct use of doctor router module for admin route to be tried later

//for now
 //to get list of doctors and also check for verification 
router.get("/doctors/view",async function(req,res){
    const logDoctor= await Doctor.find()
      .then((result)=>{
        res.status(201).json({success:true,data:result});
      })
      .catch((e)=>{
        res.status(500).json({message:e});
    })
  })
  
  //for verifying the registration requests from doctors 
router.put('/doctors/update/:id',function(req,res){
const did=req.params.id;
Doctor.updateOne({_id:did},{status:1})
.then(function(result){
    res.status(200).json({message:"Doctor Verfied Successfully"})
})
.catch(function(e){
    res.status(500).json({message:e});
})

});
module.exports=router;