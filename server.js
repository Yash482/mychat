const path    = require('path');
const http    = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./components/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./components/user');

const app = express();
// create ser for socker io
const server = http.createServer(app);
const io = socketio(server);
// static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection' , (socket) => {

    socket.on('joinRoom' , ({username, room}) =>{
        
        // create new user
        const user = userJoin(socket.id, username, room) ;
        //    console.log(user);
        // join the user to the cchosen room by using function
        socket.join(user.room);
        
             // messages emitting
    // 3 types of msg emitting
    // 1. when to show msg only to new user
    socket.emit('message' , formatMessage('Admin' , 'Welcome to MyChat'));

    //2. when to show msg other than new user
    // give msg in the particular room only
    socket.broadcast.to(user.room).emit('message' , formatMessage('Admin' , user.username+ ' joined the room') );

    // get the current users for side bar
    io.to(user.room).emit('roomUsers' , {
          room : user.room,
          users : getRoomUsers(user.room)
    });
 
    });

    // Listen for chat Message
    socket.on('chatMessage', (msg) => {
        //get the current user messaging
        const user = getCurrentUser(socket.id);
        // sending the msg to particular room
        io.to(user.room).emit('message' ,formatMessage( user.username , msg));
    });

    socket.on('disconnect' , () => {
        const user = userLeave(socket.id);
        const room = user.room ;
      //  console.log(user);// gives the user who left
        if(user){
            // 3. when everyone
            io.to(user.room).emit('message' , formatMessage('Admin' ,`${user.username} left`));
        }

        // get the current users for side bar
        io.to(room).emit('roomUsers' , {
          room : room,
          users : getRoomUsers(room)
        });
    });
});

server.listen(3000 , () => {
    console.log("We are live ");
})