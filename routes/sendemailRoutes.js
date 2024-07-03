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

        const newUser = new userRegister({
            name,
            email,
            rollno,
            address,
            password,
            confirmPassword,
            role,
            isVerified: false  // Add a field to track email verification status
        });

        await newUser.save();
        await sendVerificationEmail(newUser);

        res.json({ message: 'Registration successful, please check your email to verify your account' });
    } catch (error) {
        res.json({ message: 'Something went wrong', error });
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