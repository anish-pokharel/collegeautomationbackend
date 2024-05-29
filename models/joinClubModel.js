const mongoose = require('mongoose');

const addClubSchema = new mongoose.Schema({
    name:{type:String },
    program:{type: String},
    semester:{type: String},
    clubStatus:{
        type:String,
        enum:['political','non-political'],
        default:'non-political'
    },
    clubName:{type:String},
    position:{type:String},
    reason:{ type: String, require},
    joinedDate:{type: String}
})
const addClubname= mongoose.model('addClub',addClubSchema)
module.exports= addClubname;
