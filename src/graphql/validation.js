export const validation = (schema) => {
  return (resolver) => {
    return async (parent, args, context) => {
      const result = schema.validate(args, { abortEarly: false });
      if (result.error) {
        const messageList = result.error.details.map((obj) => obj.message);
        throw new Error(messageList, { cause: 400 });
      }
      return resolver(parent, args, context);
    };
  };
};
