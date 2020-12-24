const users = require('./users')
const local = require('./passport-strategies/local')

function initialize(passport) {
  passport.use(local)
  passport.serializeUser((user, done) => {
    Object.assign(Tony.Session, {email: user.email, username: user.username})
    return done(null, user.username)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await users.getUserBy('_id', id)
      if (!user && !user.length)
        throw new Error("User not found!!!")
      user = user[0]
      Object.assign(Tony.Session, {email: user.email, username: user.username})
      return done(null, {email: user.email, username: user.username})
    } catch (e) {
      done(null, false, {message: e.message})
    }
  })
}

module.exports = initialize

