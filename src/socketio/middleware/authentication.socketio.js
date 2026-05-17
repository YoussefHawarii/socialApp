import User from "../../DB/models/user.model.js";
import { verifyToken } from "../../utils/token/token.js";

const socketAuth = async (socket, next) => {
  let authorization = socket.handshake.auth.authorization;

  //check token found
  if (!authorization) throw new Error("token required");

  // get token from header with Bearer format.
  if (!authorization.startsWith("Bearer ")) throw new Error("invalid token format");
  const token = authorization.split(" ")[1];
  //verify token
  const decoded = verifyToken({ token });
  const { id } = decoded;
  //fetch user data
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("user not found");

  if (user.changedAt?.getTime() >= decoded.iat * 1000) throw new Error("please login again", { cause: 403 });

  socket.user = user;
  socket.id = user.id;
  return next();
};

export default socketAuth;
