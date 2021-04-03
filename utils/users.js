const users = [];

function joinUser(id, name)
{
    const user = { id: id, username: name };
    users.push(user);
    return user;
}

function getUser(id)
{
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function setVideoStats(id, videoStats)
{
    getUser(id).videoStats = videoStats;
}

module.exports = 
{
    joinUser,
    getUser,
    userLeave,
    setVideoStats
};