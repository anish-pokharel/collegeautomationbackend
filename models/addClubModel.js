const mongoose = require('mongoose');

const addClubSchema = new mongoose.Schema({
   
    clubStatus:{
        type:String,required:true },
    clubName:{type:String},
    
    createdDate:{type: String}
})
const addClubname= mongoose.model('addClub',addClubSchema)
module.exports= addClubname;
