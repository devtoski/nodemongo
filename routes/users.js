const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Bring in User Model
let User = require('../models/user')

// Register Form
router.get('/register', function(req, res){
    res.render('register')
})

// Register Process
router.post('/register',
    body('first_name', 'Firstname is required').notEmpty().trim(),
    body('last_name', 'Lastname is required').notEmpty().trim(),
    body('email', 'Email is not valid').isEmail().trim(),
    body('email', 'Email is required').notEmpty(),
    body('phone_number', 'phone_number is required').notEmpty().trim(),
    body('username', 'username is required').notEmpty().trim(),
    body('password', 'Password must be at least 5 characters long').isLength({min: 5}),
    body('password2', 'Please confirm password').custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords don't match");
        } else { return value; }
        })
    , function(req, res){
    
        // Input Data
        const first_name=req.body.first_name;
        const last_name=req.body.last_name;
        const phone_number=req.body.phone_number;
        const email=req.body.email;
        const username=req.body.username;
        const password=req.body.password;
        const password2=req.body.password2;

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            res.render('register', {
                errors:errors.mapped()
            })
        } else {
            let newUser = new User({
                first_name,
                last_name,
                phone_number,
                username,
                email,
                password
            })

            // Hash Password
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if (err) throw err;
                    // Set password to hasheed
                    newUser.password = hash;
                    let db_password = newUser.passport
                    module.exports = db_password
                    // Save Data to DB
                    newUser.save()
                        .then((user)=>{
                            req.flash('success', 'You are now registered and can log in')
                            res.redirect('/users/login')
                        })
                        .catch((err)=>console.log(err))
                })
            })
        }
    } 
)

// Login Form
router.get('/login', function(req, res) {
    res.render('login')
})

// Login Process
router.post('/login', function(req, res, next) {
    passport.authenticate('local', { 
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) return next(err); 
      req.flash('success', 'You are logged out');
      res.redirect('/users/login');
    });
})
module.exports = router