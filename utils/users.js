const users = [];

function joinUser(id, username)
{
  const user = { id, username };
  users.push(user);
  return user;
}

function getUser(key)
{
  return users.find(user => user.id === key || user.username === key);
}

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getFirstUser()
{
  if (userCount() > 0)
  {
    return users[0];
  }
}

function userCount()
{
  return users.length;
}

module.exports = 
{
  joinUser,
  getUser,
  userLeave,
  userCount,
  getFirstUser
};