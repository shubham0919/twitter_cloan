// const jwt = require('jsonwebtoken')

// module.exports = function (req,res,next) {
//     const token = req.header('token')
//     if(!token) return res.status(404).json('Access Denied');

//     try {
//         const verified = jwt.verify(token, 'privateKey')
//         req.user = verified
//         next()
//     } catch (error) {
//         return res.status(404).json('Invalid Token');
//     }
// }