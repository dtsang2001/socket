const router = require('express').Router();
const db = require('../db');
const fs = require('fs');
const multer  = require('multer');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const uploads = multer({ dest: 'uploads/'});

router.get('/', (req, res) => {
    res.render('index', {
        controller : 'user',
        error : false
    });
})

router.post('/', (req, res) => {

    let auth = db.get('user').find({account : req.body.account}).value()
    let pass = req.body.password ? req.body.password : ''

    if (auth && bcrypt.compareSync(pass, auth.password)) {
        res.cookie('userId', auth.id, {signed: true})
        res.redirect('/')
    }else{
        res.render('index', {
            controller : 'user',
            error : true
        })
    }
})

router.get('/register', (req, res) => {
    res.render('index', {
        controller : 'register',
        error : false
    });
})

router.post('/register', (req, res) => {
    if (db.get('user').find({account : req.body.account}).value()) {
        res.render('index', {
            controller : 'register',
            error : true
        });
    }

    db.get('user')
        .push({
            id: req.body.id,
            account: req.body.account,
            name: req.body.name,
            avatar: '',
            status: false,
            password: bcrypt.hashSync(req.body.password, salt)
        })
        .write()

    res.redirect('/user')
})

router.get('/profile/:account', (req, res) => {
    let account  = db.get('user')
                    .find({account : req.params.account})
                    .value()

    res.render('index', {
        controller : 'profile',
        account : account,
        error : false
    })
})

router.post('/profile/:account', uploads.single('avatar'), (req, res) => {
    let error = false;
    let account  = db.get('user')
        .find({account : req.params.account})
        .value()

    let avatar = '';

    if (req.file){
        if (req.file.mimetype.split('/')[0] !== 'image') {
            fs.unlinkSync(req.file.path);
            error = true
        }else{
            if (account.avatar !== '') {
                fs.unlinkSync(account.avatar);
            }
            avatar = req.file.path;
        }
    }

    db.get('user')
        .find({account: req.params.account})
        .assign({
            avatar: avatar,
            name: req.body.name === '' ? 'chó' : req.body.name
        })
        .value()

    res.render('index', {
        controller : 'profile',
        account : account,
        error : error
    })
})

router.post('/profile/pass/:account', (req, res) => {
    let account = db.get('user')
                .find({account : req.params.account})
                .value()

    let _old = req.body.password_old
    let _new = req.body.password_new
    let error = 0;

    if (_old !== "" && _new !== "" && _new !== _old && bcrypt.compareSync(req.body.password_old, account.password)) {
        error = 0
        db.get('user')
            .find({account: req.params.account})
            .assign({
                password: bcrypt.hashSync(_new, salt)
            })
            .value()
    }else{
        error = true
    }

    res.render('index', {
        controller : 'profile',
        account : account,
        error : error
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('userId', {signed: true});
    res.redirect('/user')
})

module.exports = router;