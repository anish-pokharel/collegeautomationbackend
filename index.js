const express = require('express');
const app = express();
const connectdb = require('./db');
const cors = require('cors');
const userRoutes= require('./routes/userRoute')



app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.listen(3200,()=>{
    console.log('LocalHost is connected');
})