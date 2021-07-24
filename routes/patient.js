const express=require('express');
const router=express.Router();
const Patient=require('../models/patient');
const bcrypt=require('bcryptjs');
router.post("/register",async (req,res)=>{
    const name=req.body.name;
    const address=req.body.address;
    const email=req.body.email;
    const mobile=req.body.mobile;
    const age=req.body.age;
    const gender=req.body.gender;
    const bloodGroup=req.body.bloodGroup;
    const password=req.body.password;
    bcrypt.hash(password,10,function(err,hash){
      var pData=new Patient({name:name,address:address,email:email,mobile:mobile,gender:gender,bloodGroup:bloodGroup,age:age,password:hash});
      pData.save()
      .then(()=>{
        res.status(201).json({success:true,message:"Patient Successfully Registered"});
      })
      .catch((e)=>{ 
        res.status(500).json({message:e});
      })
     
    });
    
})
router.post("/login",function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    Patient.findOne({email:email})
      .then((pdata)=>{
        if(pdata==null)
        {
          return res.status(403).json({message:"Invalid Credentials!!"})
        }
        bcrypt.compare(password,pdata.password,function(err,result){
          if(result==false){
              return res.status(403).json({message:"Invalid Credentials"})
          }
        return res.status(201).json({success:true,data:pdata}); 
      })
      })
      .catch((e)=>{
        res.status(500).json({message:e});
    })
})
module.exports=router