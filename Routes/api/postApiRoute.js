const express = require('express')
const route = express.Router()
const apiController = require('../../Controller/apiController')


route.post('/post',apiController.post)
route.get('/post',apiController.get)
route.get('/post/:id',apiController.getreply)
route.put('/post/:id/like',apiController.put)

module.exports = route
