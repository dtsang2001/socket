
let _router = (app) => {
    app.use('/', require('./room.router'))
    app.use('/user', require('./user.router'))
}

module.exports = {
    _router : _router
};