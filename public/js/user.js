
socket.emit('user connected', {id : '', name : ''})

socket.on('create user', (data) => {
    $('input[name="id"]').val(data);
})