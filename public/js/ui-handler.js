function loadVideo(url)
{
  socket.emit('loadVideo', url);
}

function setSource(url)
{
  player.src(url);
  currentVideoStats.src = url;
}


chat_form.addEventListener('submit', (e) =>
{
  e.preventDefault();
  console.log(chat_input.value);

  socket.emit('chatMessage', chat_input.value);

  chat_input.value = '';
  chat_input.focus();
});

player.on('play', function()
{
  currentVideoStats.currentTime = player.currentTime();
  currentVideoStats.state = 'play';
  socket.emit('videoEvt', 'play', currentVideoStats);
});

player.on('pause', function()
{
  currentVideoStats.currentTime = player.currentTime();
  currentVideoStats.state = 'pause';
  socket.emit('videoEvt', 'pause', currentVideoStats);
});

player.on('seek', function()
{
  currentVideoStats.currentTime = player.currentTime();  
  socket.emit('videoEvt', 'seek', currentVideoStats);
});