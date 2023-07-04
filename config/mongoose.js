const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

//Mongodb Connecttion Setup
mongoose.connect(process.env.MONGODB_CONNECTION);

const db = mongoose.connection

db.on('open',() => {
    console.log('DB Connected...');
})
db.once('error',(err) => {
    if(err)
    {
        console.log('DB Not Connected...');
    }
})

module.exports = db