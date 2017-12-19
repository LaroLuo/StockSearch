
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


function iosDetail(req, res, callback)
{
    var name = req.query.name
        // console.log("number" + name + " " + names[name]);
    var opt = options1;
    opt["qs"]["function"] = "TIME_SERIES_DAILY";
    opt["qs"]["symbol"] = name;
    request(opt, function(error, resp, body){
        // console.log(body)
        var file = pro_price(body)
        console.log(file)
        callback(res, file);
    });

}


function pro_price(body){
    var  price = {}
    // console.log(body)
    try{
        var jobj = JSON.parse(body);
    }
    catch (e){
        console.log(body)
        console.log(e)
        return;
    }
    var pre_close = 0;
    var time = jobj["Meta Data"]["3. Last Refreshed"];
    var i = 0;
    var last = "";
    for (var x in jobj["Time Series (Daily)"])
    {
        if (i === 0)
        {
            last = jobj["Time Series (Daily)"][x];
            i++;
        }
        else{
            pre_close = jobj["Time Series (Daily)"][x]["4. close"];
            break;
        }
    }

    var symbol = jobj["Meta Data"]["2. Symbol"];
    var volume = last["5. volume"];
    var open = last["1. open"];
    var low = last["3. low"];
    var high = last["2. high"];
    var close = last["4. close"];
    var change_price = parseFloat(pre_close) - parseFloat(close);
    var change_percent = Math.abs(change_price / parseFloat(pre_close));
    var change = change_price.toFixed(2).toString() + "(" + change_percent.toFixed(2).toString() + "%)";
    var range = parseFloat(low).toFixed(2).toString() + " - " + parseFloat(high).toFixed(2).toString();
    price["Stock Ticker Symbol"] = symbol;
    price["Last Price" ] = parseFloat(close).toFixed(2);
    price["Change (Change Percent)"] = change;
    price["Timestamp"] = time;
    price["Open"] = parseFloat(open).toFixed(2);
    price["Previous Close" ] = parseFloat(pre_close).toFixed(2);
    price["Daily Range"] = range;
    price["Volume"] = numberWithCommas(volume);
    price["change_price"] = change_price.toFixed(2)
    return price
}












function getDetails(body){
    // console.log("get details  " , body)
    // $log.info(body[0]);
    // $log.info(typeof (body[0]))

    try {var girl =JSON.parse(body)}catch(e){console.log(body,e);
    return}
    // console.log(girl)
    var pre_close = 0;
    var i = 0;
    var last = "";
    for (var j in girl["Time Series (Daily)"])
    {
        if (i === 0)
        {
            last = girl["Time Series (Daily)"][j];
            i++;
        }
        else{
            pre_close = girl["Time Series (Daily)"][j]["4. close"];
            break;
        }
    }
    try{
        var symbol = girl["Meta Data"]["2. Symbol"];
    }
    catch (e)
    {
        return
    }
    var volume = last["5. volume"];
    var close = last["4. close"];
    var change_price = (parseFloat(pre_close) - parseFloat(close));
    var price_formatted = change_price.toFixed(2)
    var change_percent = Math.abs(change_price / parseFloat(pre_close));
    var change_formatted = change_percent.toFixed(4)

    var change = change_price.toFixed(2).toString() + "(" + change_percent.toFixed(2).toString() + "%)";
    var tmp = {};
    tmp["symbol"] = symbol;
    tmp["change_percent"] = price_formatted;
    tmp["change_price"] = change_formatted;
    tmp["text"] = change;
    tmp["price"] = parseFloat(close).toFixed(2);
    tmp["volume"] = numberWithCommas(volume);
    // console.log(tmp)
    // $log.info("refresh  content debug")
    // $log.info(self.pro, self.order,self.favoList,tmp);
    return tmp;

}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
function iosRefresh(req, res, callback){
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
            file.push(getDetails(body));
            i--;
            if (i <= 0)
            {
                callback(res, file);
            }
        });
    }
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

function highchart(req, res, callback)
{
    var str = req.query.str;
    var exportUrl = 'http://export.highcharts.com/';

    var myForm = {
        "async" : true,
            "type" : "jpeg",
            "width" : 400,
            "options" : str
    }
    var options = {
        method : "POST",
        url : exportUrl,
        form : myForm
    };
    request(options,function(error, resp,body){
        callback(res, body);
    })
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
function iosNews(req, res, callback)
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
            // console.log(result)
            // console.log(result)
            var getResult = extractNews(result)
            callback(res, getResult);
        });
    })
}

function extractNews(result)
{
    // console.log(typeof (result))
    //
    // console.log(result)
    var res = result
    news = [];
    try{
        for (var i = 0; i < 5 && i < res["rss"]["channel"][0]["item"].length ; i++)
        {
            console.log(i)
            var tmp = {"title":res["rss"]["channel"][0]["item"][i]["title"].toString(),
                "pubDate" : res["rss"]["channel"][0]["item"][i]["pubDate"].toString(),
                "link":res["rss"]["channel"][0]["item"][i]["link"].toString(),
                "author":res["rss"]["channel"][0]["item"][i]["sa:author_name"].toString()
            };
            // $log.info(tmp);
            news.push(tmp);
        }
    }catch (e){
        console.log(e)
    }
    return news
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




exports.highchart = highchart;

exports.news = news;

exports.refresh = refresh;

exports.indicators = indicators;

exports.autocomplete = autocomplete;

exports.iosNews = iosNews;
exports.iosDetail = iosDetail;
exports.iosRefresh = iosRefresh;