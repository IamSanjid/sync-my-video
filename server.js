const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  joinUser,
  getUser,
  userLeave,
  setVideoStats
} = require('./utils/users');
const { 
  createVideoStats,
  processVideoEvt
} = require('./utils/video-stats');

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
  
  socket.on('loadVideo', (url) =>
  {
    console.log(`loading video ${url}`);
    setVideoStats(socket.id, createVideoStats(url));
  });
  socket.on('videoEvt', (evt) =>
  {
    const user = getUser(socket.id);
    const procEvt = processVideoEvt(evt, user.videoStats);
    setVideoStats(user.id, procEvt.videoStats);
    socket.broadcast.emit(procEvt.evt, procEvt.videoStats);
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