const express = require('express');
const history = require('connect-history-api-fallback');
const mongoPool = require('./utils/mongoPool');
const config = require('./config');

(async function init() {
  try {
    await mongoPool.connect();

    const app = express();
    //api
    app.use('/api', require('./api'));

    //static route
    const staticFileMiddleware = express.static('public');
    app.use(staticFileMiddleware);
    app.use(history());
    app.use(staticFileMiddleware);

    //start server
    let port = config.server.port;
    app.listen(port, '0.0.0.0', () => {
      console.log('Server start listening on http://localhost' + (port == 80 ? '' : ':' + port));
    });
  } catch (err) {
    console.error(err.message);
    process.exit(0);
  }
})();