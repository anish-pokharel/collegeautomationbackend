const mongoose= require('mongoose');

const DiscussionSchema= new mongoose.Schema({
    discussion_topic:{type: String, required: true},
    date:{type:String}, 
    decision_by:{type:String},
    decision:{type:String}
})
const Discussion = mongoose.model('discussion',DiscussionSchema)
module.exports = Discussion;