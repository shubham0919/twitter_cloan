module.exports.logout =  (req,res) => {
    req.session.destroy();
    res.redirect('/log/login')
}

