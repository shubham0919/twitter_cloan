const express = require('express')
const route = express.Router()
const logoutController = require('../Controller/logoutController')

route.get('/logout',logoutController.logout)


module.exports = route