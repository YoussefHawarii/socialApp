import { Router } from "express";
import isAuthenticate from "../../middleware/authentication.middleware.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import * as chatValidation from "./chat.validation.js";
import * as chatService from "./chat.service.js";
import validation from "../../middleware/validation.middleware.js";

const router = Router();
//get all chats between the user and his friend
router.get("/:friendId", isAuthenticate, validation(chatValidation.getAllChats), asyncHandler(chatService.getAllChats));
//send message to friend
router.post("/message/:friendId", isAuthenticate, validation(chatValidation.sendMessage), asyncHandler(chatService.sendMessage));

export default router;
