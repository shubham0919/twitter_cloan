const User = require('../Model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.login = (req,res) => {
    res.status(200).render('login',{
        errorMessage : ''
    })
}
module.exports.loginData = async (req,res) => {
    try {
        let payload = req.body

    if (req.body.logusername && req.body.logpassword ) {
        const user = await User.findOne({
            $or : [
                {username : req.body.logusername},
                {email : req.body.logusername}
            ]
        })
        if(!user)
        {
            payload.errorMessage = 'Data not match'
            res.status(200).render('login',payload)
        }
        else {
            let result = await bcrypt.compare(req.body.logpassword, user.password)


            const token = jwt.sign({ userID: user._id }, "privateKey");
            console.log(token);
            

            if (result === true) {
                req.session.user = user
                return res.redirect('/')
            }
            else{
                payload.errorMessage = 'Password Not Match'
                return res.status(200).render('login',payload)
            }
        }
        }

        
    } catch (error) {
        res.status(500).send('error')
    }
}