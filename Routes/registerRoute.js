const express = require('express')
const route = express.Router()
const registerController = require('../Controller/registerController')

route.get('/register',registerController.register)
route.post('/register',registerController.registerData)

module.exports = route