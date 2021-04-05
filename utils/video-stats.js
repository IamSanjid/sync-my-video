let currentVideoStats = null;

function setVideoStats(url, currentTime = 0.0, state = 'pause')
{
    currentVideoStats = {
        src: url,
        currentTime: currentTime,
        state: state
    };
}

function getVideoStats()
{
    return currentVideoStats;
}

function resetVideoStats()
{
    currentVideoStats = null;
}

function processVideoEvt(evt, videoStats)
{
    if (evt === 'play' && currentVideoStats.state !== 'play')
    {
        currentVideoStats.state = 'play';
        currentVideoStats.currentTime = videoStats.currentTime;
        return 'play';
    }
    else if (evt === 'pause' && currentVideoStats.state !== 'pause')
    {
        currentVideoStats.state = 'pause';
        currentVideoStats.currentTime = videoStats.currentTime;
        return 'pause';
    }
    else if (evt === 'seek' && videoStats.currentTime !== currentVideoStats.currentTime)
    {
        currentVideoStats.state = videoStats.state;
        currentVideoStats.currentTime = videoStats.currentTime;
        return 'seek';
    }
    return null;
}

module.exports =
{
    setVideoStats,
    getVideoStats,
    resetVideoStats,
    processVideoEvt
};