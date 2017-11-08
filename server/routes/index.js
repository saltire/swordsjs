'use strict';

const express = require('express');

const app = require('./app');


const router = module.exports = express.Router();

router.use(app);
