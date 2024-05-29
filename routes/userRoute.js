const express = require('express');
const router = express.Router();
const userRegister = require('../models/signupModel');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const newUser = new userRegister({
            name: req.body.name,
            email: req.body.email,
            // rollno: req.body.rollno,
            address: req.body.address,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
        });
        const isPasswordMatch = newUser.password == newUser.confirmPassword;
        if (!isPasswordMatch) {
            console.log(error);
            return res.json({ message: 'password doesnot match' });
        }
        await newUser.save()
        res.json({ message: 'Register Sucessfull ' });
    }
    catch (error) {
        res.json({ messgae: 'something is error', error });
    }
})

router.get('/getUserData', async (req, res) => {
    const userData = await userRegister.find();
    res.json({ userData: userData });
})


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await userRegister.findOne({ email });


        if (!userData) {
            console.log(error);
            return res.json({ message: 'username is not found ' });
        }
        const userPasswordMatch = password === userData.password;
        if (!userPasswordMatch) {
            console.log('password doesnot match ');
            return res.json({ message: 'password is incorrect' });
        }
        const userRole = userData.role;
        const token = jwt.sign({ email: userData.email }, 'secretKey');
        res.json({ message: 'Login Sucessfull', role: userRole, token: token });
    }
    catch (error) {
        res.json({ message: 'something went wrong', error });

    }
})

router.get('/userdata', async (req, res) => {
    const userData = await userRegister.find();
    res.json({ userData: userData });
})




module.exports = router;