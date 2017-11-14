var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var func = req.query.func;
    var name = req.query.name;
    res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = router;

