let express = require('express');
let auth = require('../users/auth')
let router = express.Router();

let authRoute = (passport) => {
  return router
      .post('/login', passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/auth/login',
        failureFlash: true,
      }))
      .get('/login', auth.checkNotAuth, (req, res, next) => {
        res.render('login.hbs', {
          project: Tony.Config.project_name,
          google: Tony.Config.auth && Tony.Config.auth.google,
          facebook: Tony.Config.auth && Tony.Config.auth.facebook,
          twitter: Tony.Config.auth && Tony.Config.auth.twitter,
          title: 'Login',
        })
      })
      .get('/register', auth.checkNotAuth, (req, res, next) => res.render('register.hbs', {
        project: Tony.Config.project_name,
        signup: Tony.Config.signup === undefined || Tony.Config.signup === null ? true : Tony.Config.signup,
        title: 'Register'
      }))
      .post('/register', async (req, res, next) => {
        try {
          let userData = await auth.register(req.body)
          if (userData) {
            res.json({type: 'success', message: userData})
          } else {
            res.status(400).json({type: 'error', message: 'something went wrong!!! try again'})
          }
        } catch (e) {
          res.status(404).json({type: 'error', message: e.message})
        }
      })
      .get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
      .get('/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/login'}))
      .get('/logout', auth.checkAuth, (req, res, next) => {
        Tony.Config.dev ? res.redirect("/") : auth.logout(req, res)
      }).get('/profile', auth.checkAuth, (req, res, next) => {
        res.render('profile.hbs', {
          project: Tony.Config.project_name,
          title: 'Profile',
          moduleName: Tony.Config.moduleName,
          nav: Tony.Config.nav ? Tony.Config.nav : null,
          loggedIn: Tony.Config.dev ? true : auth.isAuthenticated(req),
          username: Tony.Session && Tony.Session.username ? Tony.Session.username : null
        })
      }).get("/reset_password", auth.checkAuth, (req, res, next) => {
        res.render('resetPassword.hbs', {
          project: Tony.Config.project_name,
          title: 'Reset Password',
        })
      }).post("/reset_password", auth.checkAuth, async (req, res, next) => {
        try {
          let data = await auth.resetPassword(req.body)
          res.json(data)
        } catch (e) {
          console.log(error(`[${new Date().toDateString()}] ${e.message}`))
          res.send({error: e.message, status: 400})
        }
      })
}

module.exports = authRoute