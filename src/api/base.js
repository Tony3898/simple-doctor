const Mongo = require("../db/mongo")

class Base extends Mongo {
  constructor(collectionNAme) {
    super(collectionNAme);
  }

  async getLastDocument(key) {
    try {
      if (!key)
        throw new Error('Key is missing!!')
      let matchQuery = {sort: {}, limit: 1}
      matchQuery['sort'][key] = -1
      let last_doc = await super.find(matchQuery)
      if (last_doc && last_doc.length) {
        last_doc = last_doc[0]
        return last_doc[this.doc_id] + 1
      } else
        return 1
    } catch (e) {
      throw new Error('last document ' + e.message)
    }
  }

  async insert(options) {
    try {
      await super.connect()
      if (options.checkDuplicates) {
        let match = {}
        match[options.checkDuplicates['key']] = options.checkDuplicates['value']
        let duplicatesData = await super.find({query: match})
        if (duplicatesData && duplicatesData.length) {
          throw new Error('duplicate data found')
        }
        delete options.checkDuplicates
      }
      if (options.getLastDocument) {
        options[this.doc_id] = await this.getLastDocument(this.doc_id)
        delete options.getLastDocument
      }
      let data = await super.insert(options);
      await super.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async getByPipeline(pipeline) {
    try {
      if (!pipeline || !pipeline.length)
        throw new Error('pipeline is empty')
      await super.connect()
      let data = await this.collection.aggregate(pipeline, []).toArray()
      await super.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message())
    }
  }

  async getAll(options = {}) {
    try {
      await super.connect()
      let data = await super.find(options)
      await super.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async update(options) {
    try {
      await super.connect()
      let data = await super.update(options)
      await super.disconnect()
      return data
    } catch (e) {
      throw new Error(e.message)
    }
  }

}

module.exports = Base