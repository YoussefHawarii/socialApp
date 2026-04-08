import { model, Schema } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";

export const roles = {
  superAdmin: "superAdmin",
  admin: "admin",
  user: "user",
};

export const providers = {
  system: "system",
  google: "google",
};

export const defaultProfilePicture = "uploads//sda16548afafsa1687687sf-defaultProfilePicture.png";

export const cloudinarySecureUrl =
  "https://res.cloudinary.com/dwnyavfsw/image/upload/v1774953756/fsa-f2519_81fdsgs324-defaultProfilePicture_ajhntd.png";
export const cloudinaryPublicId = "fsa-f2519_81fdsgs324-defaultProfilePicture_ajhntd";

//schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email Already Exists"],
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false; // Password is required if provider is system
      },
    },
    userName: {
      type: String,
      minLength: 5,
      maxLength: 15,
      required: true,
      unique: [true, "userName Already exists"],
    },
    role: { type: String, enum: Object.values(roles), default: roles.user },
    isActivated: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    idLoggedIn: { type: Boolean, default: false },
    freezed: { type: Boolean, default: false },
    provider: { type: String, enum: Object.values(providers), default: providers.system },
    tempEmail: {
      type: String,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      default: null,
    },
    profilePicture: {
      public_id: { type: String, default: cloudinaryPublicId },
      secure_url: { type: String, default: cloudinarySecureUrl },
    },
    pictures: [{ type: String, default: null }],
  },
  { timestamps: true },
);

//pre save hook to hash password field
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
});

//model
export default model("User", userSchema);
