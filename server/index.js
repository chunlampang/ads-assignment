const express = require('express');
const history = require('connect-history-api-fallback');
const moment = require('moment');
const mongoPool = require.main.require('./utils/mongoPool');

(async function init() {
  try {
    await mongoPool.connect();

    const app = express();
    //api
    app.use('/api', (req, res, next) => {
      console.log(moment().format('YYYY-MM-DD HH:mm:ss'), req.ip, req.method, req.query);
      next();
    }, require('./api'));

    //static route
    const staticFileMiddleware = express.static('public');
    app.use(staticFileMiddleware);
    app.use(history());
    app.use(staticFileMiddleware);

    //start server
    app.listen(8080, () => {
      console.log('Server start listening on http://localhost:8080');
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();