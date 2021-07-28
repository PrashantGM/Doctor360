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
        res.status(201).json({success:"true",message:"Patient Successfully Registered"});
      })
      .catch((e)=>{ 
        res.status(201).json({success:"false",message:"Registration Error"});
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
          return res.status(201).json({success:"false",message:"Invalid Credentials!!"})
        }
        bcrypt.compare(password,pdata.password,function(err,result){
          if(result==false){
              return res.status(201).json({success:"false",message:"Invalid Credentials"})
          }
        return res.status(201).json({success:"true",data:pdata,message:"Patient Successfully Logged In"}); 
      })
      })
      .catch((e)=>{
        res.status(201).json({success:"false",message:e});
    })
})

//display patient details by id
router.get("/view/:id",async function(req,res){
  const id=req.params.id;
  const logPatient= await Patient.findOne({_id:id})
    .then((result)=>{
      res.status(201).json({success:"true",data:result});
    })
    .catch((e)=>{
      res.status(201).json({success:"false",message:"Error loading results"});
  })
})


router.put('/updateprofile/:id',function(req,res){
  const name=req.body.name;
  const address=req.body.address;
  const email=req.body.email;
  const mobile=req.body.mobile;
  const gender=req.body.gender;
  const age=req.body.age;
  const bloodGroup=req.body.bloodGroup;
  const pid=req.params.id;
  Patient.updateOne({_id:pid},{name:name,address:address,email:email,mobile:mobile,gender:gender,age:age,bloodGroup:bloodGroup})
  .then(function(result){
      res.status(201).json({success:"true",message:`Profile of ${name}  Updated`})
  })
  .catch(function(e){
      res.status(201).json({success:"false",message:e});
  })
});


//for password update
router.get("/viewpassword/:id",async function(req,res){
  const id=req.params.id;
  const logPatient= await Patient.findOne({_id:id})
    .then((result)=>{
      res.status(201).json({success:"true",data:result.password});
    })
    .catch((e)=>{
      res.status(201).json({success:"false",message:"Error loading results"});
  })
})
router.put('/updatepassword/:id',function(req,res){
 
  const password=req.body.password;
  const pid=req.params.id;
  Patient.updateOne({_id:pid},{password:password})
  .then(function(result){
      res.status(201).json({success:"true",message:"Password Changed Successfully"})
  })
  .catch(function(e){
      res.status(201).json({success:"false",message:e});
  })
});

module.exports=router
