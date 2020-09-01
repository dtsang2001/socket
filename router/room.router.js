
const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
    if (!req.signedCookies.userId){
        res.redirect('/user');
        return;
    }

    user = db.get('user').find({id : req.signedCookies.userId}).value();

    res.render('index', {
        controller : 'room',
        user : user
    });
})

module.exports = router;