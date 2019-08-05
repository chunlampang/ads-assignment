const express = require('express');

const router = express.Router();
const route = router.route(`/configs`);

const configs = require.main.require('./configs');

route.get(async function (req, res) {
    res.send(configs);
});

module.exports = router;