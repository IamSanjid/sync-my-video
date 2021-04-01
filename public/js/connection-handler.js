socket.on('joined', (name, video_stats) =>
{
  div_content.style.display = '';
  div_join.remove();

  if (video_stats.src != "empty")
  {
    load_url(video_stats.src);
  }
  user_name = name;
  has_joined = true;
  state = video_stats.state;
  if (state == 'play')
  {
    seek(video_stats.currentTime);
    play();
  }
});

socket.on('admin', (result) =>
{
  if (has_joined)
  {
    admin = result;
  }
});

socket.on('join', (name) =>
{
  videojs.log("joined " + name + "!");
  addMessage(name + " has joined the party!");
});

socket.on('load video', (url) =>
{
  load_url(url);
  addMessage("Loading video from " + url);
});

socket.on('pause', (current_time) =>
{
  if (has_joined)
  {
    seek(current_time);
    pause();
    addMessage("Paused the video....");
  }
});
socket.on('play', (current_time) =>
{
  if (has_joined)
  {
    state = 'play';
    seek(current_time);
    play();
    addMessage("Playing the video....");
  }
});
socket.on('seeked', (current_time) =>
{
  if (has_joined)
  {
    seek(current_time);
  }
});
socket.on('waiting', (current_time) =>
{
  if (has_joined)
  {
    videojs.log('waiting for other users to catch up....');
    seek(current_time);
    pause();
    disable_player();
    state = 'waiting';
  }
});
socket.on('continue', (current_time) =>
{
  if (has_joined)
  {
    videojs.log('continuing...');
    enable_player();
    seek(current_time);
    play();
  }
});

socket.on('left', (username) =>
{
  if (has_joined)
  {
    videojs.log(username + ' left');
    addMessage(username + ' left the party!');
  }
});

socket.on('chat message', (username, msg) =>
{
  if (has_joined)
  {
    addMessage(username + ": " + msg);
  }
});