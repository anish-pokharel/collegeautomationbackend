const express = require('express');
const app = express();
const connectdb = require('./db');
const cors = require('cors');
const userRoutes= require('./routes/userRoute')
const discussion= require('./routes/discussionRoutes')
const joinClub= require('./routes/joinClubRoutes')
const sponsorShip= require('./routes/sponsorshipRoutes')
const addUser=require('./routes/attendanceRoutes')
const addClub=require('./routes/addClubRoutes')
const enrollment= require('./routes/enrollmentRoutes')
const feedback= require('./routes/feedBackRoute')
const anserAssignment= require('./routes/anserAssignmentRoute')
const sponsorshipRequest= require('./routes/sponsorshipRequestRoute')

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(discussion);
app.use(joinClub);
app.use(addClub);
app.use(enrollment);
app.use(sponsorshipRequest);
app.use(anserAssignment);
app.use(feedback);
app.use(sponsorShip);
app.use(addUser);
app.listen(3200,()=>{
    console.log('LocalHost is connected');
})