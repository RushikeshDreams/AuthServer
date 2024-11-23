const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/,
    },

    password: {
      type: String,
      required: true,
      set: (p) => bcrypt.hashSync(p, 10),
    },

    refreshTokens: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 20;
        },
        message: 'Exceeds the maximum array size of 20',
      },
      default: [],
    },
  },
  { timestamps: true }
);
userModel.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.SECRETKEY,
    {
      expiresIn: process.env.ACCESSEXPIRE,
    }
  );
};

userModel.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRETKEY,
    {
      expiresIn: process.env.REFRESHEXPIRE,
    }
  );
};

const UserModel = mongoose.model('Admin', userModel);

module.exports = UserModel;
