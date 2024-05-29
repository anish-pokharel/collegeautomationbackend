const mongoose= require('mongoose');

const AttendanceSchema= new mongoose.Schema({
    Name:{type: String, require},
    Program:{type:String}, 
    Semester:{type:String},
    Rollno:{type:Number},
    Subject:{type: String},
    Date:{type: Date},
    Remarks:{
        type:String
    }
})
const Attendance = mongoose.model('attendance',AttendanceSchema)
module.exports = Attendance;