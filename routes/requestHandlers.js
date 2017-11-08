var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');
/* GET home page. */


var options = {
    uri:"https://www.alphavantage.co/query",
    headers: {
        'User-Agent': 'Request-Promise'
    },
    method: 'GET',
    qs:{
        // "outputsize":"full",
        "apikey": 'CDKCCWMUQ1F9WNKE'
    }
}


function refresh(req, res, callback)
{
    var names = req.query.name.split('-');
    console.log(names);
    var file = {};
    var i = 0;
    for (var name in names)
    {
        console.log("number" + name + " " + names[name]);
        var opt = options;
        opt["qs"]["function"] = "TIME_SERIES_DAILY";
        opt["qs"]["symbol"] = names[name];
        request(options, function(error, resp, body){
            file[names[name]] = body;
            console.log(file);
            i = i + 1;
            console.log(names.length +"  " +i);
            if (i == names.length)
            {
                callback(req, res, file);
            }
        })
    }
}









exports.refresh = refresh;

