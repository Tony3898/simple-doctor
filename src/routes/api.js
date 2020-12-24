let express = require('express');
let router = express.Router();
let {info, error} = require("../misc/style")

module.exports = router.post("*", async (req, res) => {
  try {
    let reqPath = req.originalUrl.split("/api/")[1]
    let apiCall = reqPath.split('.')
    let reqClass = apiCall[0]
    let reqMethod = apiCall[1]
    let apiData = req.body
    console.log(info((`[${new Date().toLocaleString()}] Calling ${reqClass + '/' + reqMethod}`)))
    reqClass = APICLASSES[reqClass]
    let data = await reqClass[reqMethod](apiData)
    res.json(data)
  } catch (e) {
    console.log(error(`[${new Date().toDateString()}] ${e.message}`))
    res.status(404).send({error: e.message, status: 400})
  }
})