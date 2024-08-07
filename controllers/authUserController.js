const db = require('../middleware/queries');
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

async function registerPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("authUser/register", { errors: errors.array() });
    }
    try {
        const { firstname, lastname, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.insertUser(firstname, lastname, username, hashedPassword);
        req.login(user, function(err) {
            if (err) {
                console.log(err);
                return res.send("An error occurred")
            }
            res.redirect("/board");
        })
    } catch (err) {
        console.log(err);
        res.send("An error occurred");
    }
}

async function upgradeUser(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("profile", { errors: errors.array(), currentUser: req.user});
    }
    try {
        const user = await db.upgradeUser(req.user.id);
        req.login(user, function(err) {
            if (err) {
                console.log(err);
                return res.send("An error occurred")
            }
            res.redirect("/board");
        })
    } catch (err) {
        console.log(err);
        res.send("An error occurred");
    }
}

module.exports = {
    registerPost,
    upgradeUser
}