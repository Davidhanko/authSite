const express = require('express');
const {body} = require("express-validator");
const router = express.Router();
const controller = require('../controllers/authUserController');
const passport = require("../middleware/passport");

router.get(['/', '/login'], (req, res) => {
    res.render('authUser/login', {messages: req.flash()})
});


router.get('/register', (req, res) => {
    res.render('authUser/register');
});

router.post('/register',
    [
        body('firstname').notEmpty().withMessage('First name is required').trim().escape(),
        body('lastname').notEmpty().withMessage('Last name is required').trim().escape(),
        body('username').notEmpty().withMessage('Username is required').trim().escape(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').trim().escape(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }).trim().escape()
    ],
    controller.registerPost
);

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('error', info.message);
            req.flash('username', req.body.username)
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/board');
        });
    })(req, res, next);
});

module.exports = router;