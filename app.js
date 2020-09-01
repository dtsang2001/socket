const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParse = require('body-parser');
const db = require('./db');

const port = process.env.PORT || 3000;

const router = require('./router/index');
const socket = require('./socket/index');

db.defaults({ chat: [], user: []})
    .write()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended : false}))
app.use(cookieParser('asdkjasasdksasadas34827oe7kffo23kdsidsu'));

app.use('/public', express.static( path.join(__dirname, 'public')))
app.use('/uploads', express.static( path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
    // global.BASE_URL = req.protocol+"://"+req.headers.host
    global.BASE_URL = "https://"+req.headers.host
    next()
})

//router
router._router(app);

//socket
socket._socket(io);

http.listen(port, () => {
    console.log('Listen in port '+port)
})