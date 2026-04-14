import { model, Schema } from "mongoose";
import { Types } from "mongoose";

//schema
const postSchema = new Schema(
  {
    text: {
      type: String,
      minlength: 2,
      required: function () {
        return this.images || this.images.length ? false : true;
      },
    },
    images: [{ secure_url: String, public_id: String }],
    user: { type: Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    cloudFolder: {
      type: String,
      unique: true,
      required: function () {
        return this.images.length ? true : false;
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

postSchema.virtual("comments", {
  ref: "Comment", // second collection name
  foreignField: "post", // FK
  localField: "_id", // PK
  // justOne:
});

//pagination query
postSchema.query.paginate = async function (page) {
  //pagination logic
  page = page ? page : 1;
  const limit = 4;
  const skip = limit * (page - 1);

  const data = await this.skip(skip).limit(limit);
  const posts = await this.model.countDocuments();
  return {
    data,
    currentPage: Number(page),
    totalposts: posts,
    totalPages: Math.ceil(posts / limit),
    postsPerPage: data.length,
  };
};

//model
const Post = model("Post", postSchema);

export default Post;
