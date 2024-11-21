require('dotenv').config();
const express = require('express');
const cors = require('cors');
const api = require('./api.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173', 'http://192.168.31.26:5173'],
  credentials: true,
};
app.use(cors(corsOptions));
app.get('/ping', (_, res) => res.status(200).json({ message: 'All Good' }));
app.use('/api', api);

mongoose
  .connect(process.env.MONGODBURL)
  .then(() =>
    app.listen(process.env.PORT, process.env.HOST, () => console.log(`Server listning on port ${process.env.PORT}`))
  );
