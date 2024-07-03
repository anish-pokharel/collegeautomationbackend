const express = require('express');
const router = express.Router();
// const Student = require('../models/otpModel')
const Student = require('../models/otpModel');
const nodemailer = require('nodemailer');

function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c;
    return d;
}


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
    const { email, otp, location } = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString();

    try {
        const student = await Student.findOne({ email, otp, date: formattedDate });
        if (student) {
            const otpLocation = {
                latitude: student.latitude,
                longitude: student.longitude
            };

            const distance = haversineDistance(location, otpLocation);
            if (distance <= 1) { // 1 km range
                student.present = true;
            } else {
                student.present = false;
            }
            await student.save();
            res.status(200).json({ success: true, message: 'Attendance marked successfully' });
        } else {
            res.status(404).json({ success: false, error: 'Invalid OTP or email' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
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
router.post('/send-otp', async (req, res) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString(); // Format as 'Fri Jun 07 2024'

    const { email, location } = req.body;
    const otp = generateOtp();

    try {
        const student = new Student({
            email,
            otp,
            otpExpiration: Date.now() + 5 * 60 * 1000,
            present: false,
            date: formattedDate,
            latitude: location.latitude,
            longitude: location.longitude
        });
        await sendOtp(email, otp, formattedDate, location);
        await student.save();
        res.status(200).send('OTP sent');

    } catch (err) {
        console.error('Error generating OTP:', err);
        res.status(500).send('Error generating OTP');
    }
});


module.exports = router;