socket.on('message', (msg) =>
{
  addMessage("Server: " + msg);
});

socket.on('chatMessage', (message) =>
{
  addMessage(message.username + ": " + message.msg);
});

socket.on('loadVideo', (videoStats) => 
{
  currentVideoStats = videoStats;
  loadVideo();
});

socket.on('videoEvt', (evt, videoStats) =>
{
  console.log('server forward evt: ' + evt);
  handleServerVideoEvt(evt, videoStats);
});

socket.on('failJoin', () =>
{
  window.location.href = '/?error=failJoin';
});

socket.on('addCC', (data) =>
{
  addCC(data);
});