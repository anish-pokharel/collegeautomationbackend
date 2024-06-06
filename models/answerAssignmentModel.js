const mongoose= require('mongoose');

const answerAssignmentSchema= new mongoose.Schema({
    subject:{type: String, required:true},
    assignment:{type:String}, 
    assignmentFile:{type:String},
    rollno:{type:Number}
})
const Answer_Assignment = mongoose.model('answer_assignment',answerAssignmentSchema)
module.exports = Answer_Assignment;