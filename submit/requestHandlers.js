
var request = require('request');
var parseString = require('xml2js').parseString;
/* GET home page. */

var options1 = {
    uri:"https://www.alphavantage.co/query",
    headers: {
        'User-Agent': 'Request-Promise'
    },
    method: 'GET',
    qs:{
        "outputsize":"full",
        "apikey": 'Y2P3YSL5T1BL3NSA'
    }
}
function autocomplete(req, res, callback)
{
    var name = req.query.name;
    var options = {
        url : "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json",
        headers: {
            'User-Agent': 'Request-Promise'
        },
        method: 'GET',
        qs:{
            input:name,
        }
    }
    request(options, function(error, resp, body){
            callback(res, body);
    });

}
function refresh(req, res, callback)
{
    var names = req.query.name.split('-');
    var file = [];
    var i = names.length;
    for (var name in names)
    {
        // console.log("number" + name + " " + names[name]);
        var opt = options1;
        opt["qs"]["function"] = "TIME_SERIES_DAILY";
        opt["qs"]["symbol"] = names[name];
        request(opt, function(error, resp, body){
            file.push(body);
            i--;
            if (i <= 0)
            {
                callback(res, file);
            }
        });
    }
}





function news(req, res, callback)
{
    var name = req.query.name;
    var options = {
        uri : "https://seekingalpha.com/api/sa/combined/" + name + ".xml",
        headers: {
            'User-Agent': 'Request-Promise'
        },
        method: 'GET'
    }
    request(options, function(error, resp, body){
        parseString(body, function (err, result) {
            // console.log(result);
            // console.log((result["rss"]["channel"]));
            callback(res, result);
        });
    })
}
function indicators(req, res, callback)
{
    var name = req.query.name;
    var inds = ["Price","SMA","EMA","STOCH","RSI","ADX","CCI","BBANDS","MACD"];
    var num = inds.length;
    var file = {};
    for (var i in inds) {
        var opt = options1;
        // opt["qs"]["outputsize"] = "full";
        opt["qs"]["symbol"] = name;
        if (inds[i] === "Price") {
            opt["qs"]["function"] = "TIME_SERIES_DAILY"
            // opt["qs"]["outputsize"] = "full";
        } else {
            opt["qs"]["function"] = inds[i];
            opt["qs"]["interval"] = "daily";
            opt["qs"]["time_period"] = 10;
            opt["qs"]["series_type"] = "close";
            if (inds[i] === "STOCH") {
                opt["qs"]["slowkmatype"] = 1;
                opt["qs"]["slowdmatype"] = 1;
            } else if (inds[i] === "BBANDS") {
                opt["qs"]["nbdevup"] = 3;
                opt["qs"]["nbdevdn"] = 3;
                opt["qs"]["time_period"] = 5;
            }
        }
        request(opt, function (error, resp, body) {
            // console.log(num);
            // console.log(opt["qs"]["outputsize"]);
            // console.log(body);
            try{
                var j_obj = JSON.parse(body);
            }
            catch (e){
                if (e instanceof SyntaxError) {
                    console.log(e);
                    num--;
                    if (num <= 0) {
                        callback(res, file);
                    }
                    return;
                }

            }
            var func_name = ""
            if ("Meta Data" in j_obj){
                if ("2: Indicator" in j_obj["Meta Data"])
                {
                    var str = JSON.parse(body)["Meta Data"]["2: Indicator"];
                    func_name = str.substring(str.indexOf('(') + 1, str.length - 1);

                }else {
                    func_name = "Price"
                }
            }else
            {
                func_name = "error";
                num--;
                if (num <= 0) {
                    callback(res, file);
                }
                return;
            }
            console.log(func_name);
            file[func_name] = body;
            num--;
            if (num <= 0) {
                callback(res, file);
            }
        });
    }

}






exports.news = news;

exports.refresh = refresh;

exports.indicators = indicators;

exports.autocomplete = autocomplete;