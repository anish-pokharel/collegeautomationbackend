const mongoose = require('mongoose');

const addClubSchema = new mongoose.Schema({
    clubStatus:{type :String , require:true},
    clubName:{type:String},

})
const addClubname= mongoose.model('addClub',addClubSchema)
module.exports= addClubname;