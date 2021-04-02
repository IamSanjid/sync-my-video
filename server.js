const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  joinUser,
  getUser,
  userLeave
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>
{
  console.log('new ws connection...');
  socket.on('join', (username) =>
  {
    const user = joinUser(socket.id, username);
    socket.broadcast.emit('message', `${user.username} has joined!`);
    socket.emit('message', 'Welcome to trashy sync video, ' + user.username + '!');
  });
  socket.on('chatMessage', (msg) =>
  {
    io.emit('chatMessage', { username: getUser(socket.id).username, msg: msg });
  });
  socket.on('disconnect', () =>
  {
    const user = userLeave(socket.id);
    if (user)
    {
      io.emit('message', `${user.username} has left!`);
    }
  });
});


server.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});