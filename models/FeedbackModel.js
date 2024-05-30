const mongoose= require('mongoose');

const FeedbackSchema= new mongoose.Schema({
    feedback_by:{
        type: String, 
        enum:['Admin','Teacher','Student'], required:true
    },
    feedback_to_role:{type: String, 
        enum:['Admin','Teacher','Student'], required:true },
    feedback:{type:String},
    date:{type:Date}
})
const Feedback = mongoose.model('feedback',FeedbackSchema)
module.exports = Feedback;