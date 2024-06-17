const express = require('express');
const router = express.Router();
const multer = require('multer');
const userRegister = require('../models/signupModel');
const jwt = require('jsonwebtoken');
const verifyToken=require('../middleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });


router.post('/signup', async (req, res) => {
    try {
        const newUser = new userRegister({
            name: req.body.name,
            email: req.body.email,
            rollno:req.body.rollno,
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
      return res.json({ messgae: 'something is error', error });
    }
})

// router.get('/getUserData', async (req, res) => {
//     const userData = await userRegister.find();
//     res.json({ userData: userData });
// })

router.get('/user/faculty', async (req, res) => {
    try {
      const faculty = await userRegister.find({ role: 'faculty' });
      const count = await userRegister.countDocuments({ role: 'faculty' });
      res.json({ faculty, count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.get('/user/student', async (req, res) => {
    try {
      const student = await userRegister.find({ role: 'student' });
      const count = await userRegister.countDocuments({ role: 'student' });
      res.json({ student, count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.get('/user/secretary', async (req, res) => {
    try {
      const secretary = await userRegister.find({ role: 'secretary' });
      const count = await userRegister.countDocuments({ role: 'secretary' });
      res.json({ secretary, count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

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
        // const token = jwt.sign({ email: userData.email }, 'secretKey');
        const token = jwt.sign({ email: userData.email, userId: userData._id , name: userData.name , rollno: userData.rollno }, 'secretKey');

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
 


router.get('/getuserdata', verifyToken, async (req, res) =>{
    try{
            const { email } = req.user;
            const userdata= await userRegister.findOne({email});
            if(userdata){
                return res.json({ data: userdata });
            }
            else{
                res.status(404).json({message: "data not found"});
            }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error });
    }
})

router.put('/userdata/:id', verifyToken,upload.single("photo"), async (req, res) => {
  try {
    const { address,biography,facebook,instagram,whatsapp,website }= req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const updateData = {
      address,
      photo:`http://localhost:3200/uploads/${file.filename}`,
      biography,
      facebook,
      instagram,
      whatsapp,
      website
  };

  const updatedUser = await userRegister.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
  );

  res.json({ message: 'Profile updated successfully', userdata: updatedUser });

  } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
  }
});

router.put('/password/:id', verifyToken, async (req, res) => {
  try {
    const {oldpassword, password,confirmPassword}=req.body;
    const user= await userRegister.findById(req.params.id);
  if(user.password != oldpassword){
    return res.status(400).json({ error: 'Password did not match' });
  }
  else{
    const userData= { password,confirmPassword };
    const updateduserdata = await userRegister.findByIdAndUpdate(
      req.params.id,
      userData,
      { new: true }
  );
  res.json({ message: 'Password updated successfully', userdata: updateduserdata });
  }
        } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
  }
});
module.exports = router;


