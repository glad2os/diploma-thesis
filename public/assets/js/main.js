const chatForm = document.getElementById('name');
const messages = document.getElementById('messages');

const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// join chat room
socket.emit('joinRoom', {
    username, room
});

//Get room & users
socket.on('roomUsers', ({room, users}) => {
    //TODO: Front-end part
    console.log(room);
    console.log(users);
})

socket.on('message', message => {
    messages.insertAdjacentHTML("beforeend", `
    <div class="message">
    <div class="username">${message.username}</div>
    <div class="time">${message.time}</div>
    <div class="text">${message.text}</div>
</div>
    `);
    messages.scrollTop = messages.scrollHeight
});

//Message submit
chatForm.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        const msg = e.target.value;

        socket.emit('chatMessage', msg);
        e.target.value = "";
        e.target.focus();
    }
});

socket.on('disconnect', () => {
    window.location.href = '/';
});