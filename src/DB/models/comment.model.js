import { Schema, model, Types } from "mongoose";

// schema
const commentSchema = new Schema(
  {
    post: { type: Types.ObjectId, ref: "Post", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    text: {
      type: String,
      required: function () {
        return this.image ? false : true;
      },
    },
    image: { secure_url: String, public_id: String },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    parentComment: { type: Types.ObjectId, ref: "Comment" },
    // replies: []
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
// virtual populate
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

//hook to delete replies when delete comment
commentSchema.post("deleteOne", { query: false, document: true }, async function (doc, next) {
  //delete images from cloudinary
  if (doc.image.secure_url) await cloudinary.uploader.destroy(doc.image. public_id);
  //doc == comment document that will be deleted
  const parentComment = doc._id;
  // this.constructor == Comment model
  const replies = await this.constructor.find({ parentComment });
  if (replies.length) {
    for (const reply of replies) {
      await reply.deleteOne();
    }
  }
  return next();
});

//model
const Comment = model("Comment", commentSchema);
export default Comment;
