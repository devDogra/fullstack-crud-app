const router = require('express').Router(); 
const axios = require('axios'); 

const apiurl = 'http://127.0.0.1:8443';


router.post('/', async (req, res, next) => {
    try {
        const url = apiurl + '/users';
        res.send({dummy: "dummy"}); 
    } catch(err) {
        return next(err); 
    }
})


module.exports = router;


