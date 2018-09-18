const jwt = require('jsonwebtoken');
const User = require('../../models/user');

getUserId = async (Authorization) => {
    const token = Authorization.replace('Bearer ', '');
    const { userID } = jwt.verify(token, process.env.APP_SECRET);
    return await User.findOne({userID});
}

module.exports = {
  getUserId
}