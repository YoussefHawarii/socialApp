import connectDB from "./DB/connection.js";
import authRouters from "./modules/auth/auth.controller.js";
import userRouters from "./modules/user/user.controller.js";
import postRouters from "./modules/post/post.controller.js";
import commentRouters from "./modules/comment/comment.controller.js";
import adminRouters from "./modules/admin/admin.controller.js";
import globalError from "./utils/errors/globalErrorHandler.js";
import notFound from "./utils/errors/notFound.js";
import cors from "cors";
const bootstrap = async (app, express) => {
  //connection
  await connectDB();
  //any one with URL can access the API without any restriction, i can specify the access by adding whitelist and check the origin in the cors options
  app.use(cors());
  //parsing
  app.use(express.json());
  //* to serve static files from the uploads folder to be accessed by the client as link in the browser
  // app.use("/uploads", express.static("uploads"));

  app.use("/auth", authRouters);
  app.use("/user", userRouters);
  app.use("/post", postRouters);
  app.use("/comment", commentRouters);
  app.use("/admin", adminRouters);
  // API not found
  app.all("*url", notFound);
  //handling global error
  app.use(globalError);
};

export default bootstrap;
