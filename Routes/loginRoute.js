const express = require('express')
const route = express.Router()
const loginController = require('../Controller/loginController')


route.get('/login',loginController.login)
route.post('/login',loginController.loginData)

module.exports = route
