const express = require('express');
const app = express();
const connectdb = require('./db');
const cors = require('cors');
const userRoutes= require('./routes/userRoute')
const discussion= require('./routes/discussionRoutes')
const joinClub= require('./routes/joinClubRoutes')
const sponsorShip= require('./routes/sponsorshipRoutes')



app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(discussion);
app.use(joinClub);
app.use(sponsorShip);
app.listen(3200,()=>{
    console.log('LocalHost is connected');
})