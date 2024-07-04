const express = require('express');
const router = express.Router();
const userRegister = require('../models/signupModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'karthikpokharel@gmail.com',
        pass: 'nbqr tojp uufx ikgj',
    }
});

function sendVerificationEmail(user) {
    const token = jwt.sign(
        { email: user.email },
        'secretKey',  
        { expiresIn: '1h' }  // Token expires in 1 hour
    );
    const verificationUrl = `http://localhost:3200/verify-signup?token=${token}`;
    
    const mailOptions = {
        from: 'karthikpokharel@gmail.com',
        to: user.email,
        subject: 'Email Verification for Signup',
        text: `Please click the following link to verify your login: ${verificationUrl}`
    };
    return transporter.sendMail(mailOptions);
}

router.post('/signupUser', async (req, res) => {
    try {
        const { name, email, rollno, address, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            return res.json({ message: 'Passwords do not match' });
        }
        const currentDate = new Date();
        const formattedDate = currentDate.toDateString(); // Format as 'Fri Jun 07 2024'
        const user = await userRegister.findOne({email});
        if(!user){
            const newUser = new userRegister({
                name,
                email,
                rollno,
                address,
                password,
                confirmPassword,
                role,
                registereddate:formattedDate,
                isVerified: false  // Add a field to track email verification status
            });
    
            await newUser.save();
            await sendVerificationEmail(newUser);
    
            return res.json({ message: 'Registration successful, please check your email to verify your account' });
        }
        if(user.isVerified===true){
            return res.json({ message: 'Already registered.',user });
        }else{
            const newUser = await userRegister.findOneAndUpdate({email},{
                name,
                email,
                rollno,
                address,
                password,
                confirmPassword,
                role,
                registereddate:formattedDate,
                isVerified: false  // Add a field to track email verification status
            },{new:true});
    
            //await newUser.save();
            await sendVerificationEmail(newUser);
            return res.status(200).json({ message: 'Registration successful, please check your email to verify your account' });
        }
        
    } catch (error) {
        return res.json({ message: 'Something went wrong', error:error.message });
    }
});

router.get('/verify-signup', async (req, res) => {
    try {
        const { token } = req.query;

        let decoded;
        try {
            decoded = jwt.verify(token, 'secretKey');  
        } catch (err) {
            return res.json({ message: 'Verification link expired or invalid' });
        }

        const user = await userRegister.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ message: 'Invalid verification link' });
        }

        user.isVerified = true;
        await user.save();

        res.json({ message: 'Email verification successful, you can now log in' });
    } catch (error) {
        res.json({ message: 'Something went wrong', error });
    }
});

module.exports = router;