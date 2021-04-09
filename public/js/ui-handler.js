function setSource(url)
{
  if (url !== player.src())
  {
    socket.emit('loadVideo', url);
  }
}

function loadVideo()
{
  player.src(currentVideoStats.src);
  player.currentTime(currentVideoStats.currentTime);
  if (currentVideoStats.state === 'play')
  {
    player.play();
  }
  else if (currentVideoStats.state === 'pause')
  {
    player.pause();
  }
  updateStats();
}

function handleVideoEvt(evt)
{
  if (evt !== 'seek')
  {
    currentVideoStats.state = evt;
  }
  if (!onServerEvent)
  {
    currentVideoStats.currentTime = player.currentTime();
    socket.emit('videoEvt', evt, currentVideoStats);
  }
  onServerEvent = false;
}

async function handleServerVideoEvt(evt, stats)
{
  currentVideoStats = stats;
  onServerEvent = true;
  /* on seeking event will be called... */
  player.currentTime(currentVideoStats.currentTime);
  onServerEvent = true;
  /* on play/pause event will be called... */
  if (evt === 'play')
  {
    await player.play();
  }
  else if (evt === 'pause')
  {
    player.pause();
  }
}

chat_form.addEventListener('submit', (e) =>
{
  e.preventDefault();
  if (chat_input.value)
  {
    console.log(chat_input.value);
    socket.emit('chatMessage', chat_input.value);
  }
  
  chat_input.value = '';
  chat_input.focus();
});

player.on('play', function()
{
  handleVideoEvt('play');
});

player.on('pause', function()
{
  handleVideoEvt('pause');
});

player.on('seeking', function()
{
  handleVideoEvt('seek');
});

player.on('ended', function() 
{
  hasEnded = true;
});

player.on('playing', function()
{
  hasEnded = false;
});

player.on('durationchange', function()
{
  console.log('duration was changed...');
});

function updateStats()
{
  clearTimeout(updateStatsTimeout);
  currentVideoStats.currentTime = player.currentTime();
  if (!hasEnded)
  {
    socket.emit('updateVideoStats', currentVideoStats);
    updateStatsTimeout = setTimeout(updateStats, 1000);
  }
}