const express = require('express');
const session = require("express-session");
const passport = require("./middleware/passport");
const app = express();
const {join, resolve} = require("path");
const flash = require("connect-flash");
require('dotenv').config({ path: '/dotenv.env' })

const authUserRouter = require("./routers/authUserRouter");
const siteRouter = require("./routers/siteRouter");

app.set("views", './views')
app.set("view engine", "ejs")

app.set('trust proxy', 1);
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: require("./middleware/pool"),
        tableName : 'user_sessions'
    }),
    secret: "ILOVETHISVERYSECRETKEYYOUSHOULDNOTSHAREITWITHANYONEELSELIKEFRWHATAREYOUDOINGHERESTOPPEEKINGINTOMYCODEYOUCREEPTHISCODEINTHELONGRUNDOESNTMATTERANYWAYUSEDOTENVNEXTTIME",
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 days
    saveUninitialized: false
}));
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
app.use("/site", siteRouter)

app.get("*", (req, res) => {
    res.send("404 Page Not Found")
})
app.listen(process.env.PORT, () => { console.log("app listening on port 3000!")})

module.exports = app;
