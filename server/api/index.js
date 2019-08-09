const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const api = module.exports = express.Router({ mergeParams: true });

api.use(bodyParser.json());     // to support JSON-encoded bodies
api.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

api.use((req, res, next) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'),
    req.ip, req.method, req.path, req.query);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

require("fs").readdirSync(__dirname + '/controllers').forEach((file) => {
  api.use(require("./controllers/" + file));
});