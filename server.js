const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  joinUser,
  getUser,
  userLeave,
  userCount
} = require('./utils/users');
const { 
  setVideoStats,
  getVideoStats,
  resetVideoStats,
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
    const videoStats = getVideoStats();
    socket.broadcast.emit('message', `${user.username} has joined!`);
    socket.emit('message', 'Welcome to trashy sync video, ' + user.username + '!');
    if (videoStats)
    {
      socket.emit('loadVideo', videoStats);
    }
  });
  socket.on('chatMessage', (msg) =>
  {
    io.emit('chatMessage', { username: getUser(socket.id).username, msg: msg });
  });
  
  socket.on('loadVideo', (url) =>
  {
    console.log(`loading video ${url}`);
    setVideoStats(url);
    const stats = getVideoStats();
    io.emit('loadVideo', stats);
  });
  socket.on('videoEvt', (evt, videoStats) =>
  {
    console.log(`video event: ${evt}`);
    const procEvt = processVideoEvt(evt, videoStats);
    if (procEvt !== null)
    {
      const stats = getVideoStats();
      socket.broadcast.emit('videoEvt', procEvt, stats);
    }
  });
  
  socket.on('disconnect', () =>
  {
    const user = userLeave(socket.id);
    if (user)
    {
      io.emit('message', `${user.username} has left!`);
      console.log(`${user.username} left`);
    }
    if (userCount() === 0)
    {
      resetVideoStats();
    }
  });
});


server.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});