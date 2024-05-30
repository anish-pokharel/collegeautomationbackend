const mongoose = require('mongoose');

const addClubSchema = new mongoose.Schema({
   
    clubStatus:{
        type:String,require },
    clubName:{type:String},
    
    createdDate:{type: String}
})
const addClubname= mongoose.model('addClub',addClubSchema)
module.exports= addClubname;
