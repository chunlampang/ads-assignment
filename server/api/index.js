const express = require('express');

const api = module.exports = express.Router({ mergeParams: true });

require('./offers')(api);