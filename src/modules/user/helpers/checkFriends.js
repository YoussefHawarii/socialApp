// const convertToString = (_id) => _id.toString(); ==> option 1

// String ==> function option 2

//check friends
export const areFriends = (user, friend) => {
  if (friend.friends.map(String).includes(user.id) || user.friends.map(String).includes(friend.id)) return true;
  return false;
};

//check friend requests
export const requestExists = (user, friend) => {
  if (friend.friendRequests.map(String).includes(user.id) || user.friendRequests.map(String).includes(friend.id)) return true;
  return false;
};

// relationship status of `friend` from `user`'s point of view
export const getRelationshipStatus = (user, friend) => {
  if (areFriends(user, friend)) return "friends";
  if (friend.friendRequests.map(String).includes(user.id)) return "pending_sent"; // user sent friend a request
  if (user.friendRequests.map(String).includes(friend.id)) return "pending_received"; // friend sent user a request
  return "not_friends";
};
