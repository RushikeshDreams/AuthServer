const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    const accessToken = jwt.sign({ id: user._id, name: user.name }, process.env.SECRETKEY, {
      expiresIn: process.env.ACCESSEXPIRE,
    });

    const refreshToken = jwt.sign({ id: user._id, name: user.name }, process.env.SECRETKEY, {
      expiresIn: process.env.REFRESHEXPIRE,
    });

    res.status(200).json({ refreshToken, accessToken });
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
    const newAccessToken = jwt.sign({ id: refreshTokenData.id, name: refreshTokenData.name }, process.env.SECRETKEY, {
      expiresIn: process.env.ACCESSEXPIRE,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    console.log(accesstoken);

    if (!accesstoken || !accesstoken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(accesstoken, process.env.SECRETKEY);
      console.log(decoded);

      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Access Token Expired' });
      } else {
        return res.status(401).json({ message: 'Invalid Access Token' });
      }
    }
  } catch (refreshError) {
    console.error('Refresh token verification failed:', refreshError);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
module.exports = {
  signin,
  signup,
  authenticate,
  getAccessToken,
};
