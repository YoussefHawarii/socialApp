const globalError = (error, req, res, next) => {
  const status = error.cause || 500;
  const response = { success: false, message: error.message };
  if (process.env.NODE_ENV !== 'production') response.stack = error.stack;
  return res.status(status).json(response);
};

export default globalError;
