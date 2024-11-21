const UserModel = require('../models/user');

const getUser = async (req, res, next) => {
  try {
    const users = await UserModel.find({}).lean();

    res.status(200).json({ data: { users } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  getUser,
};
