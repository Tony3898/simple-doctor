let express = require('express');
const auth = require("../users/auth")
const {info} = require("../misc/style")
let router = express.Router();

module.exports = router.get('/', (req, res, next) => {
  //console.log(info(`[${new Date().toDateString()}] ${JSON.stringify(req.user)}`))
  res.render('index.hbs', {
    digInUrl: Tony.Config.digInUrl ? Tony.Config.digInUrl : '/auth/login',
    project: Tony.Config.project_name,
    title: 'Home',
    requiredLogin: Tony.Config.requiredLogin && !Tony.Config.dev && !req.isAuthenticated(),
    moduleName: Tony.Config.moduleName,
    loggedIn: Tony.Config.dev ? true : req.isAuthenticated(),
    username: Tony.Session && Tony.Session.username ? Tony.Session.username : null
  })
})