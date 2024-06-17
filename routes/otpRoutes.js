const express = require('express');
const router = express.Router();
const Otp = require('../models/otpModel');
const Attendance = require('../models/attendanceModel');
const nodemailer = require('nodemailer');
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

// Send OTP via Email
async function sendOtp(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'karthikpokharel@gmail.com',
            pass: 'nbqr tojp uufx ikgj',
        }
    });

    let mailOptions = {
        from: 'karthikpokharel@gmail.com',
        to: email,
        subject: 'Your OTP for Attendance',
        text: `Your OTP is ${otp}. Please enter this to mark your attendance.`
    };

    await transporter.sendMail(mailOptions);
}

// API to generate and send OTP
router.post('/send-otp', async (req, res) => {
    const { studentId, email } = req.body;
    const otp = generateOtp();

    try {
        await Otp.findOneAndUpdate(
            { studentId },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );
        await sendOtp(email, otp);
        res.status(200).send('OTP sent');
    } catch (err) {
        res.status(500).send('Error generating OTP');
    }
});

// API to verify OTP and mark attendance
router.post('/verify-otp', async (req, res) => {
    const { studentId, enteredOtp, name, rollno, subject, remarks } = req.body;

    try {
        const otpRecord = await Otp.findOne({ studentId });
        if (otpRecord && otpRecord.otp === enteredOtp) {
            await Otp.deleteOne({ studentId });

            const attendance = new Attendance({
                Name: name,
                Rollno: rollno,
                Subject: subject,
                Remarks: remarks
            });

            await attendance.save();

            res.status(200).send('Attendance marked present');
        } else {
            res.status(400).send('Invalid OTP');
        }
    } catch (err) {
        res.status(500).send('Error verifying OTP');
    }
});

module.exports = router;