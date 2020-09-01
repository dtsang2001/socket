
const db = require('../db');
let data = db.get('chat').value();

let _socket = (io) => {
    // connection
    io.on('connection', (socket) => {

        socket.on('user connected', (data) => {
            socket.username = data.name;
            socket.userid = data.id;

            if (socket.username === '') {
                io.emit('create user', (socket.id))
            }else {
                db.get('user')
                    .find({id : socket.userid})
                    .assign({status : true})
                    .value()

                io.emit('user connected', db.get('user').sortBy('status').value())
            }
        })

        if (data.length > 0) {
            data.forEach((value) => {
                socket.emit('user_chat', {
                    user: db.get('user').find({id: value.id}).value(),
                    content: value.content
                })
            })
        }

        socket.on('disconnect', () => {
            if (socket.userid) {
                db.get('user')
                    .find({id : socket.userid})
                    .assign({status : false})
                    .value()

                io.emit('user disconnected', db.get('user').sortBy('status').value())
            }
        })

        socket.on('user_chat', (data) => {

            db.get('chat')
                .push({
                    id: socket.userid,
                    content : data,
                    time : Date.now()
                })
                .write()

            io.emit('user_chat', {
                user : db.get('user').find({id : socket.userid}).value(),
                content : data
            })
        })

        socket.on('user typing', (data) => {
            io.emit('user typing', {
                result : data,
                id : socket.userid
            })
        })
    })
}

module.exports = {
    _socket : _socket
}