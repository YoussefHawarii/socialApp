export const allMiddleware = (...functions) => {
  return async (parent, args, context) => {
    let resolver = functions[functions.length - 1];
    const middlewares = functions.slice(0, -1);
    for (const middleware of middlewares.reverse()) {
      resolver = middleware(resolver);
    }
    return resolver(parent, args, context);
  };
};
