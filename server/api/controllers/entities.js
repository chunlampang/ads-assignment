const express = require('express');

const router = express.Router();
const route = router.route(`/entities`);

const entities = require.main.require('./entities');

route.get(async function (req, res) {
    res.send(entities);
});

module.exports = router;