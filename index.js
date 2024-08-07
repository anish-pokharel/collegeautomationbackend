const express = require('express');
const app = express();
const connectdb = require('./db');
const cors = require('cors');

const path = require('path'); 
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
const createDepartmentRoute= require('./routes/createDepartmentRoute')
const jobVacancy= require('./routes/jobVacancyRoute')
const addEvent= require('./routes/eventRoute')
const giveAssignment= require('./routes/giveAssignmentRoutes')
const giveQuestion= require('./routes/giveQuestionRoute')
const AcademicRecord=require('./routes/AcademicRecordRoutes')
const otpRoutes=require('./routes/otpRoutes')
const internalExamRoutes=require('./routes/internalExamRoutes')
const excelRoutes=require('./routes/excelRoutes')
const profileRoutes=require('./routes/profileRoutes')
const InternalMarksPredictRoutes=require('./routes/InternalMarksPredictRoutes')
const idCard=require('./routes/idcardRoutes');
const sendemail=require('./routes/sendemailRoutes');

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(discussion);
app.use(joinClub);
app.use(addClub);
app.use(enrollment);
app.use(createDepartmentRoute);
app.use(anserAssignment);
app.use(feedback);
app.use(sponsorShip);
app.use(sponsorshipRequest);
app.use(addUser);
app.use(jobVacancy);
app.use(addEvent);
app.use(giveAssignment);
app.use(giveQuestion);
app.use(AcademicRecord);
app.use(otpRoutes);
app.use(internalExamRoutes);
app.use(profileRoutes);
app.use(InternalMarksPredictRoutes);
app.use(idCard);
app.use(excelRoutes);
app.use(sendemail);

  // Serve static files from the "uploads" directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3200,()=>{
    console.log('LocalHost is connected');
})