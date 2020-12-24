const Base = require('./base')
const coreAuth = require("../users/auth")
const coreUsers = require("../users/users")

class Patients extends Base {
  constructor(collectionName) {
    super(collectionName)
    this.doc_id = 'username';
    super.setContext({doc_id: this.doc_id, slug: true})
  }

  async insert(options) {
    try {
      let {
        firstname,
        lastname,
        email,
        phone,
        address,
        pincode,
        city,
        state,
        diagnosis,
        prescribedMedication,
        country
      } = options
      let register = await coreAuth.register({
        firstname,
        lastname,
        email,
        phone,
        status: 1,
        password: 'Healthcare@123', //temp basis, not for real project.
        type: 'patient'
      })
      return await super.insert({
        username: register.insertedId,
        address,
        pincode,
        city,
        state,
        diagnosis,
        prescribedMedication,
        country
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async getAll(options) {
    try {
      let pipeline = [{
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: '_id',
          as: 'patientData'
        }
      }, {
        $unwind: {
          path: '$patientData',
          preserveNullAndEmptyArrays: true
        }
      },
        {
          '$project': {
            'patientData.firstname': 1,
            'patientData.lastname': 1,
            'patientData.email': 1,
            'patientData.username': 1,
            'patientData.status': 1,
            'patientData.type': 1,
            'patientData.phone': 1,
            'city': 1,
            'pincode': 1,
            'state': 1,
            'country':1,
            'address': 1,
            'prescribedMedication': 1,
            'diagnosis': 1
          }
        }
      ]
      if (options.query)
        pipeline = [{$match: options.query}, ...pipeline]
      await super.connect()
      let data = await this.collection.aggregate(pipeline).toArray();
      await super.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async update(options) {
    try {
      if (options.update.meta)
        delete options.update.meta
      let {
        firstname,
        lastname,
        email,
        phone,
        address,
        pincode,
        city,
        state,
        diagnosis,
        prescribedMedication,
        country
      } = options.update
      await coreUsers.connect()
      let updated = await coreUsers.update({query: options.query, update: {firstname, lastname, email, phone}});
      await coreUsers.disconnect()
      await super.update({
        query: options.query,
        update: {address, city, state, diagnosis, prescribedMedication, country, pincode}
      })
      return updated
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = new Patients('patients')