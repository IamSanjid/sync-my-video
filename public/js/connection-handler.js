socket.on('message', (msg) =>
{
    addMessage("Server: " + msg);
});

socket.on('chatMessage', (message) =>
{
    addMessage(message.username + ": " + message.msg);
});