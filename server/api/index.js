const express = require('express');
const moment = require('moment');

const api = module.exports = express.Router({ mergeParams: true });

api.use((req, res, next) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'), req.ip, req.method, req.query);
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

require("fs").readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js')
        require("./" + file)(api);
});