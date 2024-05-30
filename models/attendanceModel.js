const mongoose= require('mongoose');

const AttendanceSchema= new mongoose.Schema({
    Name:{type: String, required:true},
    Rollno:{type:Number},
    Subject:{type: String},
    Date:{type: Date},
    Remarks:{
        type:String
    }
})
const Attendance = mongoose.model('attendance',AttendanceSchema)
module.exports = Attendance;