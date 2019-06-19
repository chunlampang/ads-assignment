const express = require('express');
const history = require('connect-history-api-fallback');
const mongoPool = require.main.require('./utils/mongoPool');

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
    app.listen(80, '0.0.0.0', () => {
      console.log('Server start listening on http://localhost');
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();