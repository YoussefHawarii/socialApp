import chat from "../../DB/models/chat.model.js";
import User from "../../DB/models/user.model.js";

export const getAllChats = async (req, res) => {
  const { friendId } = req.params;

  const friend = await User.findById(friendId);
  if (!friend) return next(new Error("Friend not found", { cause: 404 }));

  const data = await chat
    .findOne({
      members: { $all: [req.user._id, friendId] },
    })
    .populate("members");
  if (!data) return next(new Error("Chat not found", { cause: 404 }));

  return res.status(200).json({ success: true, data });
};

/* export const sendMessage = async (req, res) => {
  const { friendId } = req.params;
  const { content } = req.body;

  const friend = await User.findById(friendId);
  if (!friend) return next(new Error("Friend not found", { cause: 404 }));

  let data = await chat.findOne({
    members: { $all: [req.user._id, friendId] },
  });
  if (!data) {
    data = await chat.create({ members: [req.user._id, friendId] });
  }

  data.messages.push({ sender: req.user._id, content });
  await data.save();
  return res.status(200).json({ success: true, message: "Message sent", data });
}; */
