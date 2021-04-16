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
  if (!isPlayerReady()) 
  {
    return;
  }
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

function addCC(data)
{
  if (currentVideoStats.currentTime > 0 && currentVideoStats.state === 'play')
  {
    return;
  }
  var vttBlob = new Blob([data.bytes], { type: 'text/vtt' });
  var blobURL = URL.createObjectURL(vttBlob);
  player.addRemoteTextTrack({
    src: blobURL,
    srclang: data.srclang,
    label: data.label,
    kind: 'subtitles'
  }, true);
}

function handleCMD(msg)
{
  var args = msg.split(" ");
  if (args && args.length > 1)
  {
    console.log(args);
    switch(args[0])
    {
      case 'addCC':
        srt_label.value = args[1];
        srt_file.click();
        break;
    }
  }
}

srt_file.addEventListener('change', async () =>
{
  if (srt_file.files && srt_file.files[0])
  {
    var fileBytes = new Uint8Array(await srt_file.files[0].arrayBuffer());
    const slabel = srt_label.value;
    var data = 
    {
      bytes: fileBytes,
      label: slabel,
      srclang: slabel.length > 2 ? slabel.substring(0, 2) : slabel
    };
    console.log(data);
    socket.emit('addSrt', data);
    srt_label.value = '';
  }
});

chat_form.addEventListener('submit', (e) =>
{
  e.preventDefault();
  if (chat_input.value)
  {
    const msg = chat_input.value;
    console.log(msg);
    if (msg.startsWith('!'))
    {
      handleCMD(msg.replace('!', '')); 
    }
    else
    {
      socket.emit('chatMessage', msg);
    }
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