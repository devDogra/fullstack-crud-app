const mongoose = require('mongoose'); 

async function getAllFromDatabase(modelname) {
    const Model = mongoose.model(modelname);
    const instances = Model.find();
    return instances; 
}