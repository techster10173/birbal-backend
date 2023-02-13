const jwt = require("jsonwebtoken");

const checkIfAuthenticated = (req, res, next) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.sendStatus(403);
    }

    const { user } = jwt.verify(authToken, process.env.JWT_SECRET);
    req.authId = user;
  } catch (err) {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    throw error;
  }
  next();
};

module.exports = {
  checkIfAuthenticated,
}