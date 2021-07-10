const express=require('express');
const server=express();

const bodyParser=require('body-parser');
require('./database/db');
const patientroute=require('./routes/patient');
const doctorroute=require('./routes/doctor');
server.use(bodyParser.urlencoded({extended:false}));
server.use(express.json());
server.use(patientroute);
server.use(doctorroute);

const PORT = process.env.PORT || 90;
server.listen(PORT, console.log(
    `server running on port : ${PORT}`
  )
);

