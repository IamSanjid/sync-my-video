socket.on('message', (msg) =>
{
    addMessage("Server: " + msg);
});

socket.on('chatMessage', (message) =>
{
    addMessage(message.username + ": " + message.msg);
});

socket.on('loadVideo', (url) => 
{
    setSource(url);
});

socket.on('play', (videoStats) =>
{
});

socket.on('pause', (videoStats) =>
{
});

socket.on('seek', (videoStats) =>
{
});