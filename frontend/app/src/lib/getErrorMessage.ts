import { isAxiosError } from 'axios';

// Joi validation errors arrive as a comma-joined string (the backend does `new Error(messageList)`
// on an array, which JS stringifies without spaces) — reflow it for readability.
function reflowJoinedMessage(message: string): string {
  return message.includes(',') ? message.split(',').join(', ') : message;
}

/** Extracts a user-friendly message from any thrown error, preferring the backend's `message` field. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === 'string' && backendMessage.length > 0) {
      return reflowJoinedMessage(backendMessage);
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
