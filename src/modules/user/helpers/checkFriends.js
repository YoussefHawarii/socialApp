// const converToString = (_id) => _id.toString(); ==> option 1

// String ==> function option 2

//chek friends
export const areFriends = (user, friend) => {
  if (friend.friends.map(String).includes(user.id) || user.friends.map(String).includes(friend.id)) return true;
  return false;
};

//check friend requests
export const requestExists = (user, friend) => {
  if (friend.friendRequests.map(String).includes(user.id) || user.friendRequests.map(String).includes(friend.id)) return true;
  return false;
};
