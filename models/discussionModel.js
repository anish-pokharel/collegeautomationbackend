const mongoose= require('mongoose');

const DiscussionSchema= new mongoose.Schema({
    discussion_topic:{type: String, require},
    date:{type:Date}, 
    decision_By:{type:String},
    decision:{type:String}
})
const Discussion = mongoose.model('discussion',DiscussionSchema)
module.exports = Discussion;