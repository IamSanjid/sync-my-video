const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
const check_admin = process.env.CHK_ADMIN || false;

let admin_user = "";
let video_stats = 
{
  state: 'pause',
  src: 'empty',
  currentTime: 0.0
};

function is_admin(username)
{
  if (check_admin && admin_user == username)
  {
    return true;
  }
  return !check_admin;
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});

io.on('connection', (socket) => {
  socket.on('join', (name) =>
  {
    console.log(`${name} has joined.`);
    socket.broadcast.emit('join', name);
    socket.emit('joined', name, video_stats);
    socket.username = name;
    socket.hasJoined = true;
  });
  socket.on('load video', (url) =>
  {
    console.log(`loading video ${url}...`);
    io.emit('load video', url);
    video_stats.src = url;
    video_stats.currentTime = 0.0;
  });
  socket.on('admin', (secret_phase) =>
  {
    console.log(`${socket.username} is trying to be admin with key ${secret_phase}`);
    if (secret_phase == '123445678' && admin_user == "")
    {
      socket.emit('admin', true);
      admin_user = socket.username;
    }
    else
    {
      socket.emit('admin', false);
    }
  });
  socket.on('chat message', (msg) =>
  {
    if (socket.hasJoined)
    {
      io.emit('chat message', socket.username, msg);
    }
  });
  /* player */
  socket.on('play', (current_time) =>
  {
    if (is_admin(socket.username) && video_stats.state != 'waiting')
    {
      console.log(`${socket.username} playing from ${current_time}`);
      socket.broadcast.emit('play', current_time);
      video_stats.state = 'play';
      video_stats.currentTime = current_time;
    }
  });
  socket.on('pause', (current_time) =>
  {
    if (is_admin(socket.username) && video_stats.state != 'waiting')
    {
      console.log(`${socket.username} paused at ${current_time}`);
      socket.broadcast.emit('pause', current_time);
      video_stats.state = 'pause';
      video_stats.currentTime = current_time;
    }
  });
  socket.on('seeked', (current_time) =>
  {
    if (is_admin(socket.username) && video_stats.state != 'waiting')
    {
      console.log(`${socket.username} seeked to ${current_time}`);
      socket.broadcast.emit('seeked', current_time);
      video_stats.currentTime = current_time;
    }
  });
  socket.on('waiting', (current_time) =>
  {
    console.log(`${socket.username} is waiting at ${current_time}`);
    /*if (video_stats.state != 'waiting')
    {
      socket.broadcast.emit('waiting', current_time);
      video_stats.state = 'waiting';
      video_stats.currentTime = current_time;
    }*/
  });
  socket.on('continue', (current_time) =>
  {
    console.log(`${socket.username} now continuing from ${current_time}`);
    /*socket.broadcast.emit('continue', current_time);
    video_stats.currentTime = current_time;
    video_stats.state = 'play'*/
  });
  /* end of player */

  socket.on('disconnect', () => {
    io.emit('left', socket.username);
    console.log(`${socket.username} disconnected!`);
  });
});

http.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`);
});