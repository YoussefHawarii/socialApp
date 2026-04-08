export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((error) => {
      //check if error is empty object
      if (Object.keys(error) == 0) {
        return next(new Error(error.message));
      }
      //if not empty
      return next(error);
    });
  };
};
