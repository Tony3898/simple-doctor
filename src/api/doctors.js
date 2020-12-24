const Base = require('./base')
const coreAuth = require("../users/auth")
const coreUsers = require("../users/users")

class Doctors extends Base {
  constructor(collectionName) {
    super(collectionName)
    this.doc_id = 'username';
    super.setContext({doc_id: this.doc_id, slug: true})
  }

  async insert(options) {
    try {
      let {firstname, lastname, email, phone} = options
      let register = await coreAuth.register({
        firstname,
        lastname,
        email,
        phone,
        status: 1,
        password: 'doctor@123', //temp basis, not for real project.
        type: 'doctor'
      })
      return await super.insert({username: register.insertedId})
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
          as: 'doctorData'
        }
      }, {
        $unwind: {
          path: '$doctorData',
          preserveNullAndEmptyArrays: true
        }
      },
        {
          '$project': {
            'doctorData.firstname': 1,
            'doctorData.lastname': 1,
            'doctorData.email': 1,
            'doctorData.username': 1,
            'doctorData.status': 1,
            'doctorData.type': 1,
            'doctorData.phone': 1,
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
      let {firstname, lastname, email, phone} = options.update
      await coreUsers.connect()
      let updated = await coreUsers.update({query: options.query, update: {firstname, lastname, email, phone}});
      await coreUsers.disconnect()
      return updated
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = new Doctors('doctors')