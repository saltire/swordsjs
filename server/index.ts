import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import history from 'connect-history-api-fallback';
import memorystore from 'memorystore';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';

import api from './api';


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
  cookie: {
    sameSite: true,
    // secure: true,
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'session-secret-string',
  store: new (memorystore(session))({
    checkPeriod: 1000 * 60 * 60, // Prune expired sessions every 60 minutes.
  }),
}));

app.use('/api', api);

// Rewrite all routes under /* (without a dot in the filename) to go to /
app.use('/', history({ index: '/' }));
app.use('/', express.static(path.resolve(__dirname, '../dist')));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).send(err.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}.`));
