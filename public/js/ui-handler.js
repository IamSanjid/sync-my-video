function loadVideo(url)
{
  socket.emit('loadVideo', url);
}

function setSource(url)
{
  player.src(url);
}


chat_form.addEventListener('submit', (e) =>
{
  e.preventDefault();
  console.log(chat_input.value);

  socket.emit('chatMessage', chat_input.value);

  chat_input.value = '';
  chat_input.focus();
});