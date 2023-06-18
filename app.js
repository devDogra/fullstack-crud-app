const express = require('express'); 
const mongoose = require('mongoose');
const models = require('./models/Models.js'); 
const APIroutes = require('./api/api.js'); 

const port = 8443; 
const dburi = 'mongodb://127.0.0.1:27017/ocean'

app = express(); 
app.use(express.urlencoded({extended: true}));
app.use(express.json({strict: false}));

function printPath(req, res, next) {
    console.log(req.url);
    next();
}

app.use(printPath);
// API Routes
app.use('/users', APIroutes.users);
app.use('/posts', APIroutes.posts);



async function main() {

    await mongoose.connect(dburi);
    
    app.listen(port, () => {
        console.log("Server running at http://localhost:8443");
    });

}

app.use((err, req, res, next) => {
    res.send(err.message); 
    
})

main().then().catch(err => console.error(err));
