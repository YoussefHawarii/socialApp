const notFound = (req, res, next) =>
  next(new Error("API not found", { cause: 404 }));

export default notFound;
