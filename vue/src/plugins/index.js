const req = require.context("./", true, /\.js$/);
req.keys().forEach(key => req(key));