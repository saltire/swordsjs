'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const memorystore = require('memorystore');
const morgan = require('morgan');
const session = require('express-session');

const routes = require('./routes');


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'session-secret-string',
  store: new (memorystore(session))({
    checkPeriod: 1000 * 60 * 60, // Prune expired sessions every 60 minutes.
  }),
}));

app.use(routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}.`));
