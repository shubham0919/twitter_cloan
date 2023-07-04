const express = require('express')
const middleware = require("../Middleware/forLoginOrNot");
const route = express.Router()


//Home Page Route
route.get("/", middleware.requireLogin, (req, res) => {

    let payload = {
        pageTitle : 'Home',
        userLoggedIn : req.session.user,
        userLoggedInJs : JSON.stringify(req.session.user)

    }
    res.render("home",payload);
  });

route.use('/log',require('./loginRoute'))
route.use('/reg',require('./registerRoute'))
route.use('/out',require('./logoutRoute'))
route.use('/api',require('./api/postApiRoute'))


module.exports = route