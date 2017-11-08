'use strict';

const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');


const app = express();
app.use(morgan('dev'));

app.use(routes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}.`));
