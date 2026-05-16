import { verifyToken } from "../utils/token/token.js";
import User, { roles } from "../DB/models/user.model.js";

export const isAuthenticated = (roles) => {
  return (resolver) => {
    return async (parent, args, context) => {
      let { authorization } = context;

      //check token found
      if (!authorization) {
        throw new Error("token required", { cause: 403 });
      }

      // get token from header with Bearer format.
      if (!authorization.startsWith("Bearer ")) {
        throw new Error("invalid token format", { cause: 403 });
      }
      const token = authorization.split(" ")[1];
      //verify token
      const decoded = verifyToken({ token });
      const { id } = decoded;
      //fetch user data
      const user = await User.findById(id).select("-password").lean();
      if (!user) throw new Error("user not found", { cause: 403 });

      if (user.changedAt?.getTime() >= decoded.iat * 1000) throw new Error("please login again", { cause: 403 });
      //check role
      if (roles?.length && !roles.includes(user.role)) throw new Error("forbidden", { cause: 401 });
      context.user = user;
      return resolver(parent, args, context);
    };
  };
};
