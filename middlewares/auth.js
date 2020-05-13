const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //get token from header // req object has header also

  const token = req.header('x-auth-token'); // anything inside x-auth-token in req header will be returned
  if (!token) {
    res.status(401).json({ msg: 'Access denied!' });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtsecret'));
    // beacuse jwt secret is on our local machine and verify needs it to crack the token
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
