
const socket = io()

//get cookie
let _cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev
}, {});