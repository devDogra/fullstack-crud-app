const express = require('express'); 
const mongoose = require('mongoose');
const models = require('./models/Models.js'); 
const APIroutes = require('./api/api.js'); 

const port = 8443; 
const dburi = 'mongodb://127.0.0.1:27017/ocean'

app = express(); 
app.use(express.urlencoded({extended: true}));
app.use(express.json({strict: false}));

// API Routes
app.use('/users', APIroutes.users);
app.use('/posts', APIroutes.posts);



async function main() {

    await mongoose.connect(dburi);
    
    app.listen(port, () => {
        console.log("Server running at http://localhost:8443");
    });

}

