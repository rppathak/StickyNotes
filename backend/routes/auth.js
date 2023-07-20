const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const secret = `${process.env.JWT_SECRET}`

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "This email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            // password: req.body.password,
            email: req.body.email,
        })
        //   .then(user=>res.json(user));


        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, secret);


        // res.json(user)
        success = true
        res.json({ success,authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 1: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;  //destructuring from req.body
    try {
        // Check if the user with this email exists
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            success = false
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }

        //Comparing password
        const passwordCompare = await bcrypt.compare(password, user.password); //it will internally matches the password
        if (!passwordCompare) {
            success = false
            return res.status(400).json({success, error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, secret);
        success = true

        // res.json(user)
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Get logged in User Details using: POST "/api/auth/getuser". No login required
router.post('/getuser',fetchuser, async (req, res) => {
try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password") //using select we can access all attributes except paasword
    res.send(user)
} catch (error) {
    console.error(error.message);
        res.status(500).send("Internal Server Error");
}

})



module.exports = router