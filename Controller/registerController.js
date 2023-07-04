const User = require('../Model/userSchema')
const bcrypt = require('bcrypt')


module.exports.register = (req,res) => {

        res.status(200).render('register',{
            errorMessage : ''
        })
}
module.exports.registerData = async (req,res) => {
    try {
        let fistname = req.body.fistname.trim()
        let lastname = req.body.lastname.trim()
        let username = req.body.username.trim()
        let email = req.body.email.trim()
        let password = req.body.password
    
        let payload = req.body
        
        if (fistname && lastname && username && email && password) {


            const existUser = await User.findOne({
                $or : [
                    {username : req.body.username},
                    {email : req.body.email}
                ]
            })

            //No User Found
            if (existUser == null) {

                let data = req.body

                //Hashing The Password
                data.password = await bcrypt.hash(password,10)
                
                let user = await User.create(data)
                if(!user)
                {
                    return res.status(404).send({msg : 'Data not insert'});
                }
                req.session.user = user
                return res.redirect('/log/login')

            }
            //User Found
            else{
                if (existUser.email) {
                    payload.errorMessage = 'Email already in use.'
                }
                else if(existUser.username){
                    payload.errorMessage = 'Username already in use.'
                }
                return res.status(200).render('register',payload)
            } 
        }
        else{
            payload.errorMessage = 'Make sure each field has valid value'
            res.status(200).render('register',payload)
        }
    } catch (error) {
        res.status(500).send('error')
    }
}


