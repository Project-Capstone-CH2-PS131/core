const express = require('express');
const logger = require('morgan');
const multer = require('multer');
const indexRouter = require('./routes/index');
const coreRouter = require('./routes/core');
const notFoundRouter = require('./routes/notFound');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
});

const { NODE_ENV } = process.env;

app.use(logger(
  NODE_ENV === 'production' ? 'common' : 'dev'
));
app.use(upload.single('image'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/v1/core', coreRouter);
app.use('/*', notFoundRouter);

module.exports = app;
