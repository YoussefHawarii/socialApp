import connectDB from "./DB/connection.js";
import authRouters from "./modules/auth/auth.controller.js";
import userRouters from "./modules/user/user.controller.js";
import postRouters from "./modules/post/post.controller.js";
import commentRouters from "./modules/comment/comment.controller.js";
import adminRouters from "./modules/admin/admin.controller.js";
import chatRouters from "./modules/chat/chat.controller.js";
import globalError from "./utils/errors/globalErrorHandler.js";
import notFound from "./utils/errors/notFound.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/app.graph.js";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 3,
  message: "Too many requests from this IP, please try again after 5 minutes",
  // !Function to run after limit is reached (overrides message and statusCode settings, if set).
  handler: (req, res, next, options) => {
    return next(new Error(options.message, { cause: options.statusCode }));
  },
  standardHeaders: true,

  // keyGenerator: (req, res) => {
  //   return req.ip;
  // },
});
const bootstrap = async (app, express) => {
  //connection
  await connectDB();
  //any one with URL can access the API without any restriction, i can specify the access by adding whitelist and check the origin in the cors options
  app.use(cors());
  //parsing
  app.use(express.json());
  //* to serve static files from the uploads folder to be accessed by the client as link in the browser
  // app.use("/uploads", express.static("uploads"));
  //!rate limiting to limit the number of requests from a single IP address in a given time frame, which helps to prevent abuse and protect against DDoS attacks.
  app.use(limiter);
  app.use(helmet()); //* doesn't have a big effect on my project, but mainly we use it during building a MVC project
  app.use(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      formatError: (err) => {
        return {
          success: false,
          message: err.originalError?.message,
          statusCode: err.originalError?.cause || 500,
        };
      },
    }),
  );
  app.use("/auth", authRouters);
  app.use("/user", userRouters);
  app.use("/post", postRouters);
  app.use("/comment", commentRouters);
  app.use("/admin", adminRouters);
  app.use("/chat", chatRouters);
  // API not found
  app.all("*url", notFound);
  //handling global error
  app.use(globalError);
};

export default bootstrap;
