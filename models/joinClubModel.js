const mongoose = require('mongoose');

const joinClubSchema = new mongoose.Schema({
    joinedBy:{type:String},
    clubStatus:{
        type:String,required:true },
    clubName:{type:String},
    reason:{type:String},
    joinedDate:{type: String},
    decision:{type:String,
        enum:['Requested','Accepted','Rejected']
    }
})
const joinClub= mongoose.model('joinClub',joinClubSchema)
module.exports= joinClub;