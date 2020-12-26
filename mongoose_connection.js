const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
.then((value) => {
    console.log('Sucessfully connected to remote database');
}).catch((error) => {
    console.log(error);
})