global.Tony = {
  Config: {},
  Session: {},
}
require('./src/config')
const express = require("express")
const users = require("./src/users/users")
const auth = require("./src/users/auth")
const initializePassport = require("./src/users/passport-config")
const path = require("path")
const cors = require('cors');
const app = express()
const hbs = require('hbs')
const morgan = require("morgan")
const body_parser = require("body-parser")
const cookie_parser = require("cookie-parser")
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const {success, error, info} = require("./src/misc/style")


// setup view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views/partials"));
app.use(express.urlencoded({extended: false}))
app.use("/public/assets", express.static(path.join(__dirname, "/public/assets")));
app.use('/dist', express.static(path.join(__dirname, "/dist")));
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper("concatNav", function (path) {
  return `/app/${Tony.Config.moduleName}/${path}`;
});


//init default classes for api calls
global.APICLASSES = {users, auth}
require("./src/index")

// setup express app

const secret = users.generateRandomString()
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}));
app.use(flash())
app.use(morgan('dev', {}))
app.use(cors())

app.use(session({
  name: 'tony3898_Auth',
  secret: secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 8 * 60 * 60 * 1000,
    maxAge: 8 * 60 * 60 * 1000,
    secure: false,
  }
}))
app.use(cookie_parser(secret))

// init passport
// configure app to use passport
app.use(passport.initialize())
app.use(passport.session())
initializePassport(passport)


//import all routers
app.use("/session", (req, res, next) => {
  res.json({session: req.session, isAuth: auth.isAuthenticated(req), user: req.user, u: req.users})
})
app.use("/sessionFailure", (req, res, next) => {
  res.json({session: req.session, isAuth: auth.isAuthenticated(req), user: req.user, u: req.users})
})
app.use('/', require("./src/routes/partials"))
app.use('/app', require('./src/routes/app'))
app.use("/api", require('./src/routes/api'))
app.use("/auth", require('./src/routes/auth')(passport))
app.get("/notfound", (req, res, next) => {
  res.render('404.hbs')
})

if (Tony.Config.dev) {
  Object.assign(Tony.Session, {
    username: 'Tony3898',
    email: 'contact@tejasrana.in'
  })
}
// listen app
app.set('port', Tony.Config.connection.port)
app.listen(Tony.Config.connection.port, () => {
  console.log(info("listening on http://" + Tony.Config.connection.host + ":" + Tony.Config.connection.port))
  // TODO: setup dev mode, no login in dev mode
})


module.exports = app

