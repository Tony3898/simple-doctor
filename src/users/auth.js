const users = require("./users")
const BaseAuth = require("./baseAuth")

class Auth extends BaseAuth {

  async authUser(userEmail, userPassword, provider) {
    try {
      return await super.authUser(userEmail, userPassword, provider);
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async register(options) {
    try {
      Object.assign(options, {status: 1})
      return await super.register(options);
    } catch (e) {
      throw new Error(e.message)
    }
  }

  logout(req, res) {
    req.logout()
    delete Tony.Session.email
    delete Tony.Session.username
    res.redirect('/')
  }

  isAuthenticated(req) {
    return req.isAuthenticated()
  }

  checkAuth(req, res, next) {
    console.log('check Auth', req.isAuthenticated())
    if (Tony.Config.dev || req.isAuthenticated()) {
      return next()
    }
    res.redirect("/")
  }

  checkAuthForApis(req, res, next) {
    if (Tony.Config.dev || req.isAuthenticated()) {
      return next()
    }
    res.redirect("/auth/login")
  }

  checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  async getLoggedInUserData() {
    try {
      if (Tony.Config.dev) {
        return {
          username: 'Tony3898',
          email: 'contact@tejasrana.in',
          firstname: 'Tejas',
          lastname: 'Rana',
          phone: '+91-7001603384',
          status: 1,
          type: 'doctor',
        }
      } else if (Tony.Session && Tony.Session.username)
        return await super.getLoggedInUserData();
      else
        return {message: 'No user logging yet'}
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async resetPassword(options) {
    try {
      let user = await users.getUserBy("_id", Tony.Session.username)
      if (!user || !user.length)
        throw new Error('user not found')
      await users.connect()
      let {password: newPassword} = users.generatePassword(options.password, user[0].salt)
      return await users.update({query: {_id: Tony.Session.username}, update: {password: newPassword}})
    } catch (e) {
      throw new Error(e.message)
    } finally {
      await users.disconnect()
    }
  }
}

module.exports = new Auth()