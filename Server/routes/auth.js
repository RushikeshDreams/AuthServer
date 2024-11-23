const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessAndRefreshTokens } = require('../controller/userController');

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const newUser = new UserModel({ email, name, password: password, refreshTokens: [] });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error registering user');
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 20) {
      user.refreshTokens.shift();
    }

    await user.save();

    res.status(200).json({ accessToken, refreshToken, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const getAccessToken = async (req, res, next) => {
  try {
    const { refreshtoken } = req.headers;
    const refreshTokenData = jwt.verify(refreshtoken, process.env.SECRETKEY);
    if (refreshTokenData.name === 'TokenExpiredError') {
      return res.status(404).json({ message: 'Token Expired' });
    }
    const user = await UserModel.findById(refreshTokenData?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const lastToken = user.refreshTokens[user.refreshTokens.length - 1];
    if (!lastToken || lastToken !== refreshtoken) {
      return res.status(401).json({ message: 'Refresh token is incorrect' });
    }
    const { accessToken } = await generateAccessAndRefreshTokens(user?._id);
    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    if (!accesstoken) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    const decoded = jwt.verify(accesstoken, process.env.SECRETKEY);
    const user = await UserModel.findById(decoded?._id);
    if (user.refreshTokens.length >= 20) {
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({
        message: 'Too many refresh tokens. Please log out from other devices.',
      });
    }
    req.user = decoded;
    next();
  } catch (refreshError) {
    console.error('Refresh token verification failed:', refreshError);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const signout = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.refreshTokens = [];
    await user.save();

    res.status(200).json({ message: 'Signed out successfully. All refresh tokens cleared.' });
  } catch (error) {
    console.error('Error in signout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signin,
  signup,
  signout,
  authenticate,
  getAccessToken,
};
