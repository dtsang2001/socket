let user = $('#info_user');
let box_chat = $('#box_chat');
let formChat = $('#form_chat');
let inputChat = $('#message');
let boxMember = $('#member');
let _idCookie = _cookie.userId.split('.')[0].slice(4);
let isTyping = false;

socket.on('user_chat', (data) => {
    send_data(data)
})

function send_data(data) {
    let _class = '';
    if (data.user.id === _idCookie) {
        data.user.name = 'you';
    } else {
        _class = 'other';
    }

    if ($(box_chat).attr('data-id') !== data.user.id) {
        $(box_chat).attr('data-id', data.user.id);
        box_chat.append(TAG.chat_new(data.content, data.user, _class));
    } else {
        box_chat.append(TAG.chat_old(data.content, _class));
    }
    scrollBot()
}

socket.emit('user connected', {id: user.data('id'), name: user.data('name')})
socket.on('user connected', (data) => {
    $('.item_user').remove();
    render_list_user(data)
})

socket.on('user disconnected', (data) => {
    $('.item_user').remove();
    render_list_user(data)
})

function render_list_user(data){
    data.reverse().forEach((value) => {
        if (value.id !== user.data('id')){
            boxMember.append(TAG.list_user(value));
        }
    })
}

socket.on('user typing', (data) => {
    if (data.result && data.id !== _idCookie) {
        box_chat.append(TAG.user_typing())
    } else {
        $('.user_typing').remove()
    }
    scrollBot()
})

inputChat.on('keyup', (event) => {
    let isTypingNow = true;

    if (inputChat.val().length === 0) {
        isTypingNow = false;
    }

    if (isTyping !== isTypingNow) {
        isTyping = isTypingNow
        socket.emit('user typing', isTypingNow)
    }
})

formChat.on('submit', (event) => {
    event.preventDefault();
    if (inputChat.val().trim()) {
        socket.emit('user_chat', inputChat.val())
        isTyping = false
        socket.emit('user typing', false)
        inputChat.val('')
    }
})

let TAG = {
    user_typing: () => `
        <div class="user_typing">
            <div class="spinner-grow text-secondary spinner-grow-sm" role="status"></div>
            <div class="spinner-grow text-secondary spinner-grow-sm" role="status"></div>
            <div class="spinner-grow text-secondary spinner-grow-sm" role="status"></div>
        </div>`,
    chat_new: (content, user, other) =>
        `<li class="${other}">
            <img src="${ user.avatar === '' ? "/public/media/avatar.jpg" : "/"+user.avatar}" alt="${user.name}">
            <h5>${user.name}</h5>
        </li>
        <p class="${other}"><span>${content}</span></p>`,

    chat_old: (content, other) =>
        `<p class="${other}"><span>${content}</span></p>`,

    list_user: (data) =>
        `<div class="item_user">
            <div class="user_avatar">
                <img src="${ data.avatar === '' ? "/public/media/avatar.jpg" : "/"+data.avatar}" alt="${data.name}">
            </div>
            <div class="item_info">
                <h4>${data.name}</h4>
                <p>
                    <span class="tick ${data.status ? 'online' : ''}"></span>
                    <span class="status">${data.status ? 'Online' : 'Offline'}</span>
                </p>
            </div>
        </div>`
}

let scrollBot = () => {
    box_chat.scrollTop(box_chat.prop('scrollHeight'));
    return false
}