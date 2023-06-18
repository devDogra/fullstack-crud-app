const express = require('express'); 
const mongoose = require('mongoose');

const port = 8443; 
const dburi = 'mongodb://127.0.0.1:27017/ocean'

app = express(); 

async function main() {

    await mongoose.connect(dburi);
    
    app.listen(port, () => {
        console.log("Server running at http://localhost:8443");
    });

}


