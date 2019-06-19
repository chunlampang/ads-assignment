const express = require('express');

const api = module.exports = express.Router({ mergeParams: true });

require("fs").readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js')
        require("./" + file)(api);
});