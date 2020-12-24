let fs = require('fs')
let yaml = require("js-yaml")
configContent = fs.readFileSync('./config.yaml', 'utf8');
Object.assign(Tony.Config, yaml.safeLoad(configContent))
module.exports = Tony.Config