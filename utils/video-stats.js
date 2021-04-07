class videostats 
{
  constructor(url, currentTime = 0.0, state = 'pause')
  {
    this.stats = {
      src: url,
      currentTime: currentTime,
      state: state
    };
    this.followUserId = null;
  }

  processVideoEvt(evt, videoStats)
  {
    if (evt === 'play' && this.stats.state !== 'play')
    {
      this.stats.state = 'play';
      this.stats.currentTime = videoStats.currentTime;
      return 'play';
    }
    else if (evt === 'pause' && this.stats.state !== 'pause')
    {
      this.stats.state = 'pause';
      this.stats.currentTime = videoStats.currentTime;
      return 'pause';
    }
    else if (evt === 'seek' && videoStats.currentTime !== this.stats.currentTime)
    {
      this.stats.state = videoStats.state;
      this.stats.currentTime = videoStats.currentTime;
      return 'seek';
    }
  }
  
  updateStats(newStats)
  {
    var event = null;
    if (newStats.state !== this.stats.state)
    {
      event = newStats.state;
    }
    this.stats.currentTime = newStats.currentTime;
    this.stats.state = newStats.state;
    return event;
  }
};

exports.videostats = videostats;
module.exports.videostats = videostats;