const mongoose = require('mongoose')
const func = require('../../tool/func.js')

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/project', 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            },
            function (err) {
                if(err) throw err
                let checkAdmin = func.checkAdmin()
                checkAdmin.then((result) => {
                        if(!result) {
                            func.createAdmin()
                        }
                    })
            })
        console.log(`mongoDB: Connect successfully!!!`)
    } 
    catch (error) {
        console.log(`mongoDB: Connect failure!!!`)
    }
}

module.exports = {connect}