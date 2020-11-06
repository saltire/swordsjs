'use strict';

import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import memorystore from 'memorystore';
import morgan from 'morgan';
import session from 'express-session';

import routes from './routes';


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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).send(err.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}.`));
