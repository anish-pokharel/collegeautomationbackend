const express = require('express');
const router = express.Router();
// const Student = require('../models/otpModel')
const Student = require('../models/otpModel');
const nodemailer = require('nodemailer');




function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

async function sendOtp(email, otp, date) {
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
        text: `Your OTP is ${otp}. Please enter this to mark your attendance.\n ${date}`,
        
    };

    await transporter.sendMail(mailOptions);
}

// router.post('/send-otp', async (req, res) => {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toDateString(); // Format as 'Fri Jun 07 2024'

//     const { email } = req.body;
//     const otp = generateOtp();
//    // const {date} = formattedDate;
//     //console.log(date);
//     try {
//         const student = await Student.findOneAndUpdate(
//             { email },
//             //{ date: formattedDate},
//             { otp, otpExpiration: Date.now() + 5 * 60 * 1000, present: false, 
//                 date: formattedDate  }, 
//             //{present:false},
//             { upsert: true, new: true }
            
//         );
//         await sendOtp(email, otp, formattedDate);
//         res.status(200).send('OTP sent');

//     } catch (err) {
//         console.error('Error generating OTP:', err);
//         res.status(500).send('Error generating OTP');
//     }
// });


router.post('/verify-otp', async (req, res) => {
    const { email, otp  } = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString(); 
    try {
        const student = await Student.findOne({ email, otp, date:formattedDate});
        if (student) {
            student.present = true;
            await student.save();
            res.status(200).json({ message: 'Attendance marked successfully' });
        } else {
            res.status(404).json({ error: 'Invalid OTP or email' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/attendance',  async (req, res) => {
    try {
        const attendance = await Student.find();
        res.json({ attendance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance list', error });
    }
});

router.post('/sendotp', async (req, res) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString(); // Format as 'Fri Jun 07 2024'

    const { email } = req.body;
    const otp = generateOtp();
   // const {date} = formattedDate;
    //console.log(date);
    try {
        const student = new Student({
             email ,
            //{ date: formattedDate},
             otp, otpExpiration: Date.now() + 5 * 60 * 1000, present: false, 
                date: formattedDate  , 
            //{present:false},
            //{ upsert: true, new: true }
            
    });
        await sendOtp(email, otp, formattedDate);
        await student.save();
        res.status(200).send('OTP sent');

    } catch (err) {
        console.error('Error generating OTP:', err);
        res.status(500).send('Error generating OTP');
    }
});

module.exports = router;