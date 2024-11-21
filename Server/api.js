const { Router, json } = require('express');
const router = Router();
const routes = require('./routes/index.js');

router.use('/', [json(), routes]);

router.use('*', (_, res) => {
  res.status(404).json({ error: 'Not Found ❌' });
  console.log('Route Not Found ❌');
});

router.use((error, _, res, __) => {
  res.status(error.st ?? 500).json({ error: error.ms ?? 'Something went wrong ❗' });
  console.log('Something went wrong ❗', error);
});

module.exports = router;