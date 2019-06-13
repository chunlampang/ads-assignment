const express = require('express');

(async function init(){
  await require('./initDB')();

  const app = express();
  
  app.use('/api', require('./api'));
  
  app.use(express.static('public'));
  
  app.listen(8080, function () {
    console.log('Server start listening on port http://localhost:8080');
  });
  
})();