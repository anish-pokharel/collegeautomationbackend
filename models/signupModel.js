const mongoose= require('mongoose');

const RegisterSchema= new mongoose.Schema({
    name:{type:String},
    email:{type:String, unique:true},
    rollno:{type:Number, unique:true},
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