function createVideoStats(url, currentTime = 0.0, state = 'pause')
{
    const videoStats = {
        src: url,
        currentTime: currentTime,
        state: state
    };
    return videoStats;
}

function processVideoEvt(evt, currentVS)
{
    if (evt.videoStats.state !== currentVS.state)
    {
        currentVS.state = evt.state;
    }
}

module.exports =
{
    createVideoStats,
    processVideoEvt
};