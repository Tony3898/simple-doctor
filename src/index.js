const doctors = require("./api/doctors")
const patients = require("./api/patients")
let source = {doctors, patients} // to add your classes, for api calls
// do not change this, just add all the class at *source* for api calls to work
Object.assign(APICLASSES, source)
