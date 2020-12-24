const {Strategy} = require('passport-local')
module.exports = new Strategy({usernameField: 'email', passwordField: 'password'}, require('./authenticateUser'))