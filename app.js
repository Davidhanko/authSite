const express = require('express');
const session = require("express-session");
const passport = require("./middleware/passport");
const app = express();
const {join, resolve} = require("path");
const flash = require("connect-flash");
require('dotenv').config({ path: 'dotenv.env' })

const authUserRouter = require("./routers/authUserRouter");

app.set("views", './views')
app.set("view engine", "ejs")

app.use(session({secret: "cats", resave: false, saveUninitialized: false}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({extended: false}))
app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(authUserRouter)


if(!process.env.DEVMODE){
app.get("*", (req, res) => {
    res.send("404 Page Not Found")
});
}
app.listen(3000, () => { console.log("app listening on port 3000!")})

module.exports = app;
