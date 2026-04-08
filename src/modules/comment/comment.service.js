import Comment from "../../DB/models/comment.model.js";
import Post from "../../DB/models/post.model.js";
import { roles } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";

export const createComment = async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  let image;
  if (req.file) {
    //upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments`,
    });
    //save image
    image = { secure_url, public_id };
  }

  //create comment
  const data = await Comment.create({
    text,
    image,
    user: req.user._id,
    post: postId,
  });
  return res.json({ success: true, results: { data } });
};

export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  //check if comment exist
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("comment not found", { cause: 404 }));
  // check if post exist
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  //check if user is the owner of the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    return next(new Error("you are not the owner of this comment", { cause: 403 }));
  }
  let image;
  if (req.file) {
    //upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments`,
    });
    //save image
    image = { secure_url, public_id };
    //delete old image from cloudinary
    if (comment.image) await cloudinary.uploader.destroy(comment.image.public_id);
    comment.image = image;
  }
  comment.text = text ? text : comment.text;
  await comment.save();
  //update comment
  return res.json({ success: true, results: { comment } });
};

export const softDeleteComment = async (req, res, next) => {
  const { id } = req.params;
  //check if comment exist
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("comment not found", { cause: 404 }));
  // check if post exist
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  //user who owns the comment
  const commentOwner = comment.user.toString() == req.user._id.toString();
  //user who owns the post
  const postOwner = post.user.toString() == req.user._id.toString();
  //admin
  const admin = req.user.role == roles.admin;
  if (!commentOwner && !postOwner && !admin) return next(new Error("you are not authorized to delete this post"), { cause: 403 });
  comment.isDeleted = true;
  comment.deletedBy = req.user._id;
  await comment.save();
  return res.json({ success: true, results: { comment } });
};

export const getComment = async (req, res, next) => {
  const { postId } = req.params;
  //check if post exist
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  const comments = await Comment.find({ post: postId, isDeleted: false, parentComment: { $exists: false } }).populate({ path: "replies" });
  return res.json({ success: true, results: { comments } });
};

export const likeUnlikeComment = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("comment not found", { cause: 404 }));
  // check user in likes
  const isUserExists = comment.likes.find((user) => user.toString() == userId.toString());
  if (!isUserExists) {
    comment.likes.push(userId); //like
  } else {
    comment.likes = comment.likes.filter((user) => user.toString() != userId.toString()); //unlike
  }
  await comment.save();
  const populatedComment = await Comment.findOne({ _id: id, isDeleted: false }).populate({
    path: "likes",
    select: "userName profilePicture.secure_url",
  });
  return res.json({ success: true, message: "comment like/unlike successfully", comment: populatedComment });
};

export const replyComment = async (req, res, next) => {
  const { text } = req.body;
  const { postId, id } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  const parentComment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!parentComment) return next(new Error("comment not found", { cause: 404 }));
  let image;
  if (req.file) {
    //upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${post.cloudFolder}/comments/${parentComment._id}/replies`,
    });
    //save image
    image = { secure_url, public_id };
  }
  const reply = await Comment.create({
    text,
    image,
    user: req.user._id,
    post: postId,
    parentComment: parentComment._id,
  });
  return res.json({ success: true, results: { reply } });
};

export const hardDeleteComment = async (req, res, next) => {
  const { id } = req.params;
  //check if comment exist
  const comment = await Comment.findById(id);
  if (!comment) return next(new Error("comment not found", { cause: 404 }));
  // check if post exist
  const post = await Post.findById(comment.post);
  if (!post) return next(new Error("post not found", { cause: 404 }));
  //user who owns the comment
  const commentOwner = comment.user.toString() == req.user._id.toString();
  //user who owns the post
  const postOwner = post.user.toString() == req.user._id.toString();
  //admin
  const admin = req.user.role == roles.admin;
  if (!commentOwner && !postOwner && !admin) return next(new Error("you are not authorized to delete this post"), { cause: 403 });
  //comment delete ==> delete all replies
  //*hook in comment model to delete replies
  await comment.deleteOne(); //delete comment 1
  return res.json({ success: true, message: "comment deleted successfully" });
};
