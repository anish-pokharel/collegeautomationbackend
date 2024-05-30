const mongoose = require('mongoose');

const joinClubSchema = new mongoose.Schema({
   
    clubStatus:{
        type:String,required:true },
    clubName:{type:String},
    reason:{type:String},
    createdDate:{type: String}
})
const joinClub= mongoose.model('joinClub',joinClubSchema)
module.exports= joinClub;