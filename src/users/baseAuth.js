const users = require("./users")

class BaseAuth {

  async register(options) {
    try {
      if (!options.email || !options.password)
        throw new Error("Please provide Email/Password")
      if (options.password.trim().length < 8)
        throw new Error("Password length is too short")
      await users.connect()
      options.email = options.email.toLowerCase()
      let user = await users.getUserBy("email", options.email)
      if (user && user.length) {
        throw new Error("User already exists!!!")
      }
      if (!options.username)
        options.username = options.email.split("@")[0]
      users.setContext({doc_id: "username", slug: true})
      let data = await users.insert(options)
      users.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async authUser(userEmail, userPassword, provider = 'local') {
    try {
      if (provider === 'local' && (userEmail.length === 0 || userPassword.length === 0))
        throw new Error("Please provide Email/Password")
      await users.connect()
      let user = await users.getUserBy('email', userEmail)
      users.disconnect()
      if (!user || user.length <= 0) {
        if (provider === 'local') {
          throw new Error("Email/User not found")
        } else {
          return {email: userEmail, username: userEmail.split("@")[0], new: 1}
        }
      } else {
        user = user[0]
        if (provider === 'local') {
          let {password} = users.generatePassword(userPassword, user.salt)
          if (password === user.password) {
            return {email: user.email, username: user.username}
          } else
            throw new Error("Password is incorrect!!!")
        } else if (provider === 'google') {
          return {email: user.email, username: user.username, new: 0}
        } else {
          throw new Error('Something went wrong!!!')
        }
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }


  async getLoggedInUserData() {
    try {
      await users.connect()
      let userdata = await users.getUserBy('_id', Tony.Session.username, {
        project: {
          status: 1,
          meta: 1,
          firstname: 1,
          lastname: 1,
          username: 1,
          phone: 1,
          email: 1,
          type: 1
        }
      })
      users.disconnect()
      return userdata[0]
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = BaseAuth