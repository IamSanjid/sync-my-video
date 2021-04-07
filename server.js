const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  joinUser,
  getUser,
  userLeave,
  userCount,
  getFirstUser
} = require('./utils/users');
const videostats = require('./utils/video-stats');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

var videoStats = null;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>
{
  console.log('new ws connection...');
  socket.on('join', (username) =>
  {
    var user = getUser(username);
    if (!user)
    {

      user = joinUser(socket.id, username);
      socket.broadcast.emit('message', `${user.username} has joined!`);
      socket.emit('message', 'Welcome to trashy sync video, ' + user.username + '!');
      if (videoStats)
      {
        socket.emit('loadVideo', videoStats.stats);
      }
    }
    else
    {
      socket.emit('failJoin');
    }
  });
  socket.on('chatMessage', (msg) =>
  {
    io.emit('chatMessage', { username: getUser(socket.id).username, msg: msg });
  });
  
  socket.on('loadVideo', (url) =>
  {
    console.log(`loading video ${url}`);
    videoStats = new videostats(url);
    io.emit('loadVideo', videoStats.stats);
  });
  socket.on('videoEvt', (evt, _videoStats) =>
  {
    console.log(`video event: ${evt}`);
    if (videoStats)
    {
      const procEvt = videoStats.processVideoEvt(evt, _videoStats);
      if (procEvt)
      {
        socket.broadcast.emit('videoEvt', procEvt, videoStats.stats);
      }
    }
  });
  socket.on('updateVideoStats', (_videoStats) =>
  {
    const id = videoStats.followUserId;
    if (socket.id === id)
    {
      const changedEvt = videoStats.updateStats(_videoStats);
      if (changedEvt)
      {
        socket.broadcast.emit('videoEvt', changedEvt, videoStats.stats);
      }
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
      console.log('[*]no more users left resetting video stats...[*]');
      videoStats = null;
    }
    else if (videoStats)
    {
      videoStats.followUserId = getFirstUser().id;
    }
  });
});


server.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});