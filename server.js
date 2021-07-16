const express=require('express');
const server=express();
const cors=require('cors');
require('./database/db');
require('dotenv').config();
const patientroute=require('./routes/patient');
const doctorroute=require('./routes/doctor');

//Middlewares
server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.use('/patient',patientroute);
server.use('/doctor',doctorroute);

// server.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   next();
// }) 
server.use(cors({
  methods: ['GET','POST','DELETE','UPDATE']
}));
const PORT = process.env.PORT || 90;
server.listen(PORT,()=>{
  console.log(`server running on port : ${PORT}` )
}
  
);

