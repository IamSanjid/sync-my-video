function createVideoStats(url, currentTime = 0.0, state = 'pause')
{
    const videoStats = {
        src: url,
        currentTime: currentTime,
        state: state
    };
    return videoStats;
}

function processVideoEvt(evt, videoStats, userVideoStats)
{
    if (evt === 'play' && userVideoStats.stat !== 'play')
    {
        userVideoStats.state = 'play';
        userVideoStats.currentTime = videoStats.currentTime;
        procVideoEvt.evt = 'play';
        return {
            evt: 'play',
            videoStats: userVideoStats
        };
    }
    else if (evt === 'pause' && userVideoStats.stat !== 'pause')
    {
        userVideoStats.state = 'pause';
        userVideoStats.currentTime = videoStats.currentTime;
        procVideoEvt.evt = 'pause';
        return {
            evt: 'pause',
            videoStats: userVideoStats
        };
    }
    else if (evt === 'seek' && videoStats.currentTime !== userVideoStats.currentTime)
    {
        userVideoStats.state = videoStats.state;
        userVideoStats.currentTime = videoStats.currentTime;
        procVideoEvt.evt = 'seek';
        return {
            evt: 'seek',
            videoStats: userVideoStats
        };
    }
    return null;
}

module.exports =
{
    createVideoStats,
    processVideoEvt
};