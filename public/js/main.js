const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from the url using query string cdn
const {username, room} = Qs.parse(location.search, { 
    ignoreQueryPrefix : true
});
//console.log(`${username} ${room}`);

const socket = io();

// emit the username and room to server.js
socket.emit('joinRoom' , {username, room});

// get room and its users
socket.on('roomUsers' , ({room, users}) => {
    outputRoom(room);
    outputUsers(users);
});

//message from server
socket.on('message' , message => {
   // console.log(message);
    // function to output the message
    outputMessage(message);

    // scroll down when new message
    chatMessages.scrollTop = chatMessages.scrollHeight ;
});

// Sending a message
chatForm.addEventListener('submit' , (e) => {
    e.preventDefault();

     //Get the msg from the form
    const msg = e.target.elements.msg.value ;

    // Emitting the msg to server.js
    socket.emit('chatMessage' , msg);
    
    // clear the input after emitting
     e.target.elements.msg.value = '';
      e.target.elements.msg.focus(); 
});

// function to output message to DOM
function outputMessage(message) {
    //create the div of chat messages and then send to DOM
    const div = document.createElement('div');
    // Every div of class msg has class of msg
    div.classList.add('message');
    // now adding the inside text of the div
    div.innerHTML =    ' <p class="meta">' + message.username + ' <span>' + message.time + '</span></p> <p class="text">' + message.text + '</p> '

    // div is created
    // now send to DOM
    document.querySelector('.chat-messages').appendChild(div);
}

// function to print room name
function outputRoom(room) {
    roomName.innerHTML = `${room}`
}

// function to print room users
function outputUsers(users) {
    roomUsers.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}