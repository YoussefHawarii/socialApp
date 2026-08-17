import type { User } from './user';

export interface ChatMessage {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatThread {
  _id: string;
  members: User[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAllChatsResponse {
  success: true;
  data: ChatThread;
}

export interface SendMessagePayload {
  to: string;
  message: string;
}

export interface SuccessMessageEvent {
  message: string;
  from: string;
}
