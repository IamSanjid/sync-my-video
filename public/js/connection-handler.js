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
    currentVideoStats = videoStats;
    console.log('server forward evt: ' + evt);
    if (evt === 'play')
    {        
        player.currentTime(currentVideoStats.currentTime);        
        player.play();
    }
    else if (evt === 'pause')
    {        
        player.currentTime(currentVideoStats.currentTime);
        player.pause();
    }
    else if (evt === 'seek')
    {
        player.currentTime(currentVideoStats.currentTime);        
    }
});