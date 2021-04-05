const HIDDEN_URL = 
"http://server5.ftpbd.net/FTP-5/Anime%20%26%20Cartoon%20TV%20Series/Nisemonogatari%20%28%202012%20%29/Season%201/%5BNoobSubs%5D%20Nisemonogatari%2001%20%28720p%20Blu-ray%208bit%20AAC%29.mp4"

const SAMPLE_URL =
"https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4";

const socket = io();

const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const chat_input = document.getElementById("chat-input");
const chat_form = document.getElementById("chat-form");
const messages = document.getElementById('messages');
const chat_panel = document.getElementById('chat-panel');

const options = {
};
const player = videojs('my-player', options, function onPlayerReady() {
    videojs.log(username + ', your player is ready!');
    
    socket.emit('join', username);
    this.responsive(true);
    this.fluid(true);
});

var currentVideoStats = 
{
    src: '',
    currentTime: 0.0,
    state: 'pause'
};

function addMessage(msg)
{
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    chat_panel.scrollTo(0, chat_panel.scrollHeight);
}