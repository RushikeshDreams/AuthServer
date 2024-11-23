const { signin, signup, authenticate, getAccessToken, signout } = require('./auth');
const { getUser } = require('./user');
const router = require('express').Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/signout', signout);
router.get('/token', getAccessToken);
router.get('/users', authenticate, getUser);

module.exports = router;
