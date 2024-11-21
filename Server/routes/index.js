const { signin, signup, authenticate, getAccessToken } = require('./auth');
const { getUser } = require('./user');
const router = require('express').Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/token', getAccessToken);
router.get('/users', authenticate, getUser);

module.exports = router;
