import chat from "../../DB/models/chat.model.js";
import User from "../../DB/models/user.model.js";

export const sendMessage = function (socket, io) {
  return async ({ message, to }) => {
    const friendId = to;
    const content = message;

    const friend = await User.findById(friendId);
    if (!friend) throw new Error("Friend not found");

    let data = await chat.findOne({
      members: { $all: [socket.user._id, friendId] },
    });
    if (!data) {
      data = await chat.create({ members: [socket.user._id, friendId] });
    }

    data.messages.push({ sender: socket.user._id, content });
    await data.save();

    //emit event
    socket.to(to).emit("successMessage", { message, from: socket.id });
  };
};
