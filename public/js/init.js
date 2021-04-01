var HIDDEN_URL = 
"http://server5.ftpbd.net/FTP-5/Anime%20%26%20Cartoon%20TV%20Series/Nisemonogatari%20%28%202012%20%29/Season%201/%5BNoobSubs%5D%20Nisemonogatari%2001%20%28720p%20Blu-ray%208bit%20AAC%29.mp4"

var div_player = document.getElementById("player");
var div_join = document.getElementById("join");

var join_input = document.getElementById("join-input");
var join_form = document.getElementById("join-form");

var user_name = '';
var executedCmd = 
{
    pause: false,
    play: false,
    seek: false,    
};

var options = {    
};
var player = videojs('my-player', options, function onPlayerReady() {
    videojs.log('Your player is ready!');
});

var socket = io();
var has_joined = false;
var state = 'pause';
var admin = false;

function is_player_loaded()
{
    return player.src() != "" || player.src() != null;
}

function is_executed(cmd = 'any')
{
    let result = false;
    if (cmd == 'any')
    {
        for (const cCmd in executedCmd)
        {
            if (executedCmd[cCmd])
            {
                result = true;
                break;
            }
        }
    }
    else
    {
        result = executedCmd[cmd];
        executedCmd[cmd] = false;
    }
    
    return result;
}

function addMessage(msg)
{
    return;
}