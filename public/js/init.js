var HIDDEN_URL = 
"http://server5.ftpbd.net/FTP-5/Anime%20%26%20Cartoon%20TV%20Series/Nisemonogatari%20%28%202012%20%29/Season%201/%5BNoobSubs%5D%20Nisemonogatari%2001%20%28720p%20Blu-ray%208bit%20AAC%29.mp4"

var div_content = document.getElementById("content");
var div_join = document.getElementById("join");

var join_input = document.getElementById("join-input");
var join_form = document.getElementById("join-form");

var chat_input = document.getElementById("chat-input");
var chat_form = document.getElementById("chat-form");

var messages = document.getElementById('messages');
var chat_panel = document.getElementById('chat-panel');

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
    this.responsive(true);
    this.fluid(true);
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
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    chat_panel.scrollTo(0, chat_panel.scrollHeight);
}