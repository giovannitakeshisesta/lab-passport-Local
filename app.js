require('dotenv/config');

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path')
const passport = require('passport');

const sessionConfig = require('./config/session.config');
require('./config/db.config');
require('./config/hbs.config');
require('./config/passport.config');

const app = express();

/**
 * Middlewares
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(sessionConfig);

/**
 * View setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/** 
 * Passport
*/
app.use(passport.initialize());
app.use(passport.session());

/**
 * Sessions
 */
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

/**
 * Configure routes
 */
const router = require('./config/routes.config');
app.use('/', router);



// ERRORS SETTINGS
app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  let status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

// PORT SETTINGS
const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});