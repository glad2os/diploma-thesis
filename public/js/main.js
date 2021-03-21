const chatForm = document.getElementById('chat-form');
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
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});