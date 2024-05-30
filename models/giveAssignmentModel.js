const mongoose= require('mongoose');

const giveAssignmentSchema= new mongoose.Schema({
    subject:{type: String, required:true},
    assignment:{type:String}, 
    file:{type:File},
    remarks:{type:String}
})
const Assignment = mongoose.model('give_assignment',giveAssignmentSchema)
module.exports = Assignment;