const express = require('express');
const moment = require('moment');
const mongoPool = require.main.require('./utils/mongoPool');

(async function init(){
  await mongoPool.connect();

  const app = express();
  
  app.use('/api', function (req, res, next) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), req.ip, req.method, req.query);
    next();
  }, require('./api'));
  
  app.use(express.static('public'));
  
  app.listen(8080, function () {
    console.log('Server start listening on http://localhost:8080');
  });
  
})();