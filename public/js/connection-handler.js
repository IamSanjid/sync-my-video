socket.on('joined', (name, video_stats) =>
{  
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
});

socket.on('load video', (url) =>
{
  load_url(url);
});

socket.on('pause', (current_time) =>
{
  if (has_joined)
  {
    seek(current_time);
    pause();
  }
});
socket.on('play', (current_time) =>
{
  if (has_joined)
  {
    state = 'play';
    seek(current_time);
    play();
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