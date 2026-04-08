const isAuthorized = (...roles) => {
  const flatRoles = roles.flat(); // handles both isAuthorized("user") and isAuthorized(["user"])
  return (req, res, next) => {
    if (!flatRoles.includes(req.user.role))
      return next(new Error("not Authorized", { cause: 401 }));

    return next();
  };
};

export default isAuthorized;
