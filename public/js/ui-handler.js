
function nameGiven()
{
  if (txt_name.value != "")
  {
    socket.emit('join', txt_name.value);
    div_player.style.display = 'block';
    div_ask_name.style.display = 'none';
  }
}

function set_source(url)
{
  socket.emit('load video', url);
}

function play_sample()
{
  set_source('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4');
}

function make_me_admin(secret_phase)
{
  if (has_joined)
  {
    socket.emit('admin', user_name, secret_phase);
  }
}

function disable_player()
{
  player.controlBar.progressControl.disable();
  player.controlBar.playToggle = false;
}

function enable_player()
{
  player.controlBar.progressControl.enable();
  player.controlBar.playToggle = true;
}

function seek(current_time)
{
  if (player.currentTime() != current_time)
  {
    player.currentTime(current_time);
    executedCmd = true;
  }
}

function pause()
{
  player.pause();
  executedCmd = true;
  videojs.log('paused');
}

function play()
{
  player.play();
  executedCmd = true;
  videojs.log('playing');
}

function load_url(source)
{
  if (player.src() != source)
  {
    player.src(source);
  }
}

player.on('pause', function() {
  if (!is_executed())
  {
    socket.emit('pause', user_name, this.currentTime());
  }
  state = 'pause';
});

player.on('play', function() {
  if (!is_executed())
  {
    socket.emit('play', user_name, this.currentTime());
  }
  state = 'play';
});

player.on('seeked', function() {
  if (!is_executed())
  {
    socket.emit('seeked', user_name, this.currentTime());
  }
});

player.on('waiting', function() {
  if (!is_executed() && state != 'waiting')
  {
    videojs.log('waiting...');
    socket.emit('waiting', user_name, this.currentTime());
  }
  state = 'waiting';
});

player.on('playing', function() {
  if (!is_executed() && state == 'waiting')
  {
    videojs.log('no waiting...');
    socket.emit('continue', user_name, this.currentTime());
    state = 'play';
  }
});