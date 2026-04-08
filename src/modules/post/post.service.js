import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import Post from "../../DB/models/post.model.js";
import Comment from "../../DB/models/comment.model.js";
import { nanoid } from "nanoid";
import { roles } from "../../DB/models/user.model.js";

export const createPost = async (req, res, next) => {
  const { text } = req.body;
  let images = [];
  let cloudFolder;
  if (req.files && req.files.length) {
    cloudFolder = nanoid(10);
    for (const file of req.files) {
      //upload file to cloudinary
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/users/${req.user._id}/posts/${cloudFolder}`,
      });
      images.push({ secure_url, public_id });
    }
  }
  const post = await Post.create({ text, images, cloudFolder, user: req.user._id });
  return res.json({ message: "post created successfully", post });
};

export const updatePost = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, user: req.user._id });
  if (!post) return next(new Error("post not found", { cause: 404 }));

  let images = [];
  if (req.files.length) {
    for (const file of req.files) {
      //upload file to cloudinary
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/users/${req.user._id}/posts/${post.cloudFolder}`,
      });
      images.push({ secure_url, public_id });
    }
    //delete old images from cloudinary
    if (post.images.length) {
      for (const image of post.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    post.images = images;
  }
  post.text = text ? text : post.text;
  await post.save();
  return res.json({ message: "post updated successfully" });
};

export const softDeletePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error("post not found", { cause: 404 }));
  if (post.user.toString() == req.user._id.toString() || req.user.role == roles.admin) {
    post.isDeleted = true;
    post.deletedBy = req.user._id;
  }
  await post.save();
  return res.json({ message: "post deleted successfully" });
};

export const restorePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOneAndUpdate(
    { _id: id, isDeleted: true, deletedBy: req.user._id },
    { isDeleted: false, $unset: { deletedBy: 0 } },
    { returnDocument: true, runValidators: true },
  );
  if (!post) return next(new Error("post not found", { cause: 404 }));
  return res.json({ message: "post restored successfully" });
};

export const getPost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
    { path: "user", select: "userName profilePicture.secure_url" },
    {
      path: "comments",
      select: "text image createdAt",
      match: { parentComment: { $exists: false }, isDeleted: false },
      populate: [{ path: "user", select: "userName profilePicture.secure_url" }, { path: "replies" }],
    }, //match
  ]);
  if (!post) return next(new Error("post not found", { cause: 404 }));
  return res.json({ message: "post retrieved successfully", post });
};

export const getAllActivePosts = async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({ isDeleted: false }).populate({ path: "user", select: "userName profilePicture.secure_url" });
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ isDeleted: false, user: req.user._id }).populate({ path: "user", select: "userName profilePicture.secure_url" });
  }
  //stream
  const cursor = Post.find({ isDeleted: false }).cursor();
  let results = [];
  for (let post = await cursor.next(); post != null; post = await cursor.next()) {
    const comments = await Comment.find({ post: post._id, isDeleted: false });
    results.push({ post, comments });
  }

  return res.json({ message: "posts retrieved successfully", posts });
};

export const getAllnonActivePosts = async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({ isDeleted: true }).populate({ path: "user", select: "userName profilePicture.secure_url" });
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ isDeleted: true, user: req.user._id }).populate({ path: "user", select: "userName profilePicture.secure_url" });
  }
  return res.json({ message: "posts retrieved successfully", posts });
};

export const likeAndUnlikePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await Post.findOne({ _id: id, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  // check user in likes
  const isUserExists = post.likes.find((user) => user.toString() == userId.toString());
  if (!isUserExists) {
    post.likes.push(userId); //like
  } else {
    post.likes = post.likes.filter((user) => user.toString() != userId.toString()); //unlike
  }
  await post.save();
  const populatedPost = await Post.findOne({ _id: id, isDeleted: false }).populate({ path: "likes", select: "userName profilePicture.secure_url" });
  return res.json({ success: true, message: "post like/unlike successfully", post: populatedPost });
};
