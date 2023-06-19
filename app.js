const express = require('express'); 
const mongoose = require('mongoose');
const session = require('express-session'); 

const models = require('./models/Models.js'); 
const APIroutes = require('./api/api.js'); 
const Authroutes = require('./auth-routes/auth-routes.js'); 


const port = 8443; 
const dburi = 'mongodb://127.0.0.1:27017/ocean'

app = express(); 
app.use(session({
    resave: false, 
    saveUninitialised: false, 
    secret: 'K23942873587'
}))
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

// auth routes
app.use('/register', Authroutes.register);
app.use('/login', Authroutes.login); 

/* -------------------------------------------------------------------------- */
// const axios = require('axios'); 

// app.post('/register', async (req, res, next) => {
//     try {
//         const {data: createdUser} = await axios.post('http://127.0.0.1:8443/users', req.body);
//         console.log(createdUser); 
//         res.send(createdUser); 
//     } catch(err) {
//         return next(err); 
//     }
// })
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

async function main() {

    await mongoose.connect(dburi);
    
    app.listen(port, () => {
        console.log("Server running at http://localhost:8443");
    });

}

// Error handler
app.use((err, req, res, next) => {
    res.send(err.message); 
})

main().then().catch(err => console.error(err));
