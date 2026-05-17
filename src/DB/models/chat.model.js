import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);
//schema
const chatSchema = new Schema(
  {
    members: {
      type: [{ type: Types.ObjectId, ref: "User" }],
      validate: {
        validator: function (value) {
          return value.length == 2;
        },
        message: "A chat must have 2 members.",
      },
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

//model
export default model("chat", chatSchema);
