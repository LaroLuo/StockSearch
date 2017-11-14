var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */


// apphandler for query
var handler = require('./requestHandlers');
function render(res, file)
{
    res.json(file);
}


router.use(function(req, res, next){
    console.log("something is happening.");
    next();
});

router.get('/', function(req, res, hand){
    var hand = {};
    hand["refresh"] = handler.refresh;
    hand["news"] = handler.news;
    hand["indicators"] = handler.indicators;
    hand["autocomplete"] = handler.autocomplete;
    var fun = req.query.func;
    console.log(fun);
    if(typeof hand[fun] === 'function'){
        hand[fun](req,res,render);
        console.log("get right!")
    }else{
        console.log("No request handler for " + fun);
        res.writeHead(404, {"Content-Type": "text/html"});
        res.write("404 Not found");
        res.end();
    }

});





module.exports = router;

