const express = require('express');
const history = require('connect-history-api-fallback');
const configs = require('./configs');

const app = express();
//api
app.use('/api', require('./api'));

//static route
const staticFileMiddleware = express.static('public');
app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);

//start server
let port = configs.server.port;
app.listen(port, '0.0.0.0', () => {
  console.log('Server start listening on http://localhost' + (port == 80 ? '' : ':' + port));
}).on('error', function (err) {
  console.error(err.message);
});