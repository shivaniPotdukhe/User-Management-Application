const jwt = require('jsonwebtoken');

exports.verifyJwtToken = function (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};



