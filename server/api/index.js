const express = require('express');
const moment = require('moment');

const api = module.exports = express.Router({ mergeParams: true });

api.use((req, res, next) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'),
    req.ip, req.method, req.path, req.query);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

require("fs").readdirSync(__dirname + '/controllers').forEach((file) => {
  api.use(require("./controllers/" + file));
});