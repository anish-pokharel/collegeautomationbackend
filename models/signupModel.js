const mongoose= require('mongoose');

const RegisterSchema= new mongoose.Schema({
<<<<<<< HEAD
    name:{type:String},
    email:{type:String, unique:true, required:true},
    // rollno:{type:Number, unique:true},
=======
    name:{type:String}, 
    email:{type:String, unique:true},
    rollno:{type:Number, unique:true},
>>>>>>> 78771b6154824ecb19e5d6480153a62ed9cd9cac
    address:{type:String},
    password:{type:String},
    confirmPassword:{type:String},
    role:{
        type:String,
        enum:['student','faculty','secretary','admin'],
        default:'student'
    }
})
const Register = mongoose.model('register',RegisterSchema)
module.exports = Register;