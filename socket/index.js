
const db = require('../db');
let data = db.get('chat').value();
let list_user = db.get('user').value();

let _socket = (io) => {
    // connection
    io.on('connection', (socket) => {

        socket.on('list user', () => {
            socket.emit
        })

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

                io.emit('user connected', db.get('user').value())
            }
        })

        if (data.length > 0) {
            socket.emit('send data', data);
        }

        socket.on('disconnect', () => {
            if (socket.userid) {
                db.get('user')
                    .find({id : socket.userid})
                    .assign({status : false})
                    .value()

                io.emit('user disconnected', db.get('user').value())
            }
        })

        socket.on('user_chat', (data) => {

            db.get('chat')
                .push({
                    name: socket.username,
                    id: socket.userid,
                    content : data})
                .write()

            io.emit('user_chat', {
                name : socket.username,
                id : socket.userid,
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