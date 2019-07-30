const express = require('express');
const fs = require("fs");
const path = require("path");

const router = express.Router();
const route = router.route(`/entities`);

route.get(async function (req, res) {
    let out = {};
    fs.readdirSync(path.join(__dirname,'../../entities')).forEach((file) => {
        let name = path.parse(file).name;
        out[name] = require("../../entities/" + file);
      });
    res.send(out);
});

module.exports = router;