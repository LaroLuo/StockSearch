angular.module('hw8').controller('RefreshCtrl',RefreshCtrl)
.directive('myCurrentTime', ['$interval', 'dateFilter',
    function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            var format,  // date format
                stopTime; // so that we can cancel the time updates

            // used to update the UI
            function updateTime() {
                element.text(dateFilter(new Date(), format));
            }

            // watch the expression, and update the UI on change.
            scope.$watch(attrs.myCurrentTime, function(value) {
                format = value;
                updateTime();
            });

            stopTime = $interval(updateTime, 1000);

            // listen on DOM destroy (removal) event, and cancel the next UI update
            // to prevent updating time after the DOM element was removed.
            element.on('$destroy', function() {
                $interval.cancel(stopTime);
            });
        }
    }]);
function RefreshCtrl ($log, $http, $rootScope, $sce ,$timeout,$interval) {
    var self = this;
    self.stop = undefined;
    self.storage = {};
    self.link_down = "http://cs-server.usc.edu:45678/hw/hw8/images/Down.png";
    self.link_up = "http://cs-server.usc.edu:45678/hw/hw8/images/Up.png";
    self.index = 0;
    self.dis = true;
    self.pro = "default";
    self.bookmark = true;
    self.order = "Ascending";
    self.news = [];
    self.price = [];
    self.inds = ["Price","SMA","EMA","STOCH","RSI","ADX","CCI","BBANDS","MACD"];
    self.cur_stock = true;
    self.chart = false;
    self.share_data = [];
    self.share_date = [];
    self.share_volume = [];
    self.chart_title = "";
    self.spec = "";
    self.indicator_func = "";
    self.renderCharts= renderCharts;
    self.renderHisChart = renderHisChart;
    $rootScope.$on("get_quote", getQuote);
    $rootScope.$on("get_inds", getInds);
    $rootScope.$on("get_news", getnews);
    $rootScope.$on("reset", reset);
    self.showCS = showCS;
    self.showHC = showHC;
    self.showNF = showNF;
    self.refresh = refresh;
    self.refresh_order = refresh_order;
    self.mark = mark;
    self.deleteSpec = deleteSpec;
    self.pageToRight = pageToRight;
    self.pageToLeft = pageToLeft;
    self.redraw = redraw;
    self.checkChange = checkChange;
    self.share = share;


    self.name_list = [];
    self.rec_list = [];
    self.favoList_default = [];
    self.favoList = [];
    self.tmp_html = '<div class="alert alert-danger" role="alert">\n' +
        'Error! Failed to get data.' +
        '</div>';
    self.tmp_html = '<div class="alert alert-danger" role="alert">\n' +
        'Error! Failed to get current stock data.' +
        '</div>';
    self.cur_stock_error_html = $sce.trustAsHtml(self.tmp_html);
    self.tmp_html = '<div class="alert alert-danger" role="alert">\n' +
        'Error! Failed to get historical charts data.' +
        '</div>';
    self.his_charts_error_html =$sce.trustAsHtml(self.tmp_html);
    self.tmp_html = '<div class="alert alert-danger" role="alert">\n' +
        'Error! Failed to get news data.' +
        '</div>';


    self.news_error_html = $sce.trustAsHtml(self.tmp_html);
    self.tmp_html   ='<div class="progress">' +
        ' <div class="progress-bar w-75 progress-bar-striped" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>';
    self.wait_html = $sce.trustAsHtml(self.tmp_html);
    function share(){
        var exportUrl = 'http://export.highcharts.com/';
        var optionsStr = "";
        var req = {
            method : "POST",
            url : exportUrl,
            params:{
                "async":true,
                "type":"jpeg",
                "width":400
            }
        };
        // if (self.spec === "Price")
        // {
        //       optionsStr = JSON.stringify({
        //         title: {
        //             text: self.chart_title
        //         },
        //         subtitle: {
        //             text:  '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>'
        //         },
        //         xAxis: [{
        //             categories:self.share_date,
        //             tickInterval:5
        //         }],
        //         yAxis: [{ // Primary yAxis
        //             title: {
        //                 text: 'Stock Price',
        //                 style: {
        //                     color: Highcharts.getOptions().colors[1]
        //                 }
        //             }
        //         }, { // Secondary yAxis
        //             title: {
        //                 text: 'Volume',
        //                 style: {
        //                     color: Highcharts.getOptions().colors[0]
        //                 }
        //             },
        //             opposite: true
        //         }],
        //         tooltip: {
        //             shared: true
        //         },
        //         plotOptions: {
        //             area: {
        //                 fillColor: {
        //                     linearGradient: {
        //                         x1: 0,
        //                         y1: 0,
        //                         x2: 0,
        //                         y2: 1
        //                     },
        //                     stops: [
        //                         [0, Highcharts.getOptions().colors[0]],
        //                         [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        //                     ]
        //                 },
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 },
        //                 threshold: null
        //             }
        //         },
        //         series: [{
        //             name: 'Stock Price',
        //             type: 'area',
        //
        //             data: self.share_data
        //         }, {
        //             name: 'Volume',
        //             type: 'column',
        //             yAxis: 1,
        //             data: self.share_volume
        //         }]
        //     }),
        //         req["params"]["options"] = JSON.stringify({
        //             "xAxis": {
        //                 "categories": [
        //                     "Jan",
        //                     "Feb",
        //                     "Mar",
        //                     "Apr",
        //                     "May",
        //                     "Jun",
        //                     "Jul",
        //                     "Aug",
        //                     "Sep",
        //                     "Oct",
        //                     "Nov",
        //                     "Dec"
        //                 ]
        //             },
        //             "series": [
        //                 {
        //                     "data": [1,3,2,4],
        //                     "type": "line"
        //                 },
        //                 {
        //                     "data": [5,3,4,2],
        //                     "type":"line"
        //                 }
        //             ]
        //         });
        // }else{
        //          optionsStr = JSON.stringify({
        //         title: {
        //             text: self.char_title
        //         },
        //         subtitle: {
        //             text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>'
        //         },
        //         xAxis: [{
        //             categories:self.share_date,
        //             tickInterval:5
        //         }],
        //         yAxis: [{ // Primary yAxis
        //             title: {
        //                 text: self.indicator_func,
        //                 style: {
        //                     color: Highcharts.getOptions().colors[0]
        //                 }
        //             }
        //         }],
        //         plotOptions: {
        //             series: {
        //                 marker: {
        //                     radius:2,
        //                     enabled: true
        //                 }
        //             },
        //             spline: {
        //                 marker: {
        //                     radius:1,
        //                     enabled: true
        //                 }
        //             }
        //         },
        //         series: self.share_data
        //     }),
        //          req["params"]["options"] = optionsStr;
        //         // dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);
        // }
            FB.ui({
                method: 'feed',
                link:"http://www.google.com",
                picture: 'http://www.fbrell.com/f8.jpg',
            }, (response) => {
                if (response && !response.error_message) {
                    $log.info("good!") } else {
                    $log.info("fail") }
            });

        // return $http(req).then(function(res)
        // {
        //     var ex = 'http://export.highcharts.com/';
        //     $log.info("result",res);
        //     var url = ex + res["data"];
        //     FB.ui({
        //         app_id: 1799055690397584,
        //         method: 'feed',
        //         link:url,
        //         picture: 'http://www.fbrell.com/f8.jpg',
        //     }, (response) => {
        //         if (response && !response.error_message) {
        //             $log.info("good!") } else {
        //             $log.info("fail") }
        //     });
        // })






    }

    function autoref(){
        $log.info("auto ref")
        if(angular.isDefined(self.stop)) return;
        self.stop = $interval(refresh,5000);
    }
    function stopAutoref(){
        $log.info("auto ref stop")
        if (angular.isDefined(self.stop)){
            $interval.cancel(self.stop);
            self.stop = undefined;
        }
    }

    function checkChange(){
        $log.info("check change")
        if (self.check == true)
        {
            autoref();
        }else {
            stopAutoref();
        }
    }

    function deleteSpec(spec){
        var index = self.name_list.indexOf(spec);
        self.name_list.splice(index,1);
        refresh();
    }
    function pageToLeft(){
        self.toRight = false;
        self.toLeft = true;

        // need to do this in a $timeout so ngClass has
        // chance to update the current image's class based
        // on the new toLeft and toRight settings before
        // ngSwitch acts on the new displayCard setting
        // and destroys the current images's scope.
        $timeout(function () {
            self.page = 1;
        }, 0);
    }
    function pageToRight(){
        self.toRight = true;
        self.toLeft = false;

        // need to do this in a $timeout so ngClass has
        // chance to update the current image's class based
        // on the new toLeft and toRight settings before
        // ngSwitch acts on the new displayCard setting
        // and destroys the current images's scope.
        $timeout(function () {
            self.page = 2;
        }, 0);
    }

    function reset(){
        self.page = '1';
        self.cur_stock = false;
        self.cur_form = false;
        self.cur_stock_wait = false;
        self.cur_stock_error = false;
        self.chart = false;
        self.indicators_wait = false;
        self.indicators_error = false;
        self.his_charts = false;
        self.his_charts_wait = false;
        self.his_charts_error = false;
        self.sto_news = false;
        self.sto_news_wait = false;
        self.sto_news_error = false;
        self.news_json =  "";
        self.ind_json = "";
    }
    function refresh(){
        $log.info("refresh");
        var myList = "";
        for (var x in self.name_list)
        {
            $log.info(self.name_list[x])
            myList += self.name_list[x] + "-";
        }
        myList = myList.substring(0, myList.length - 1);
        // $log.info(myList);
        // var apiurl = "http://ruiluo.site/api"
        // var apiurl = "http://localhost:3000/api"
        let apiurl = "http://hw8-envv.us-west-1.elasticbeanstalk.com/api";
        var req = {
            method : "GET",
            url : apiurl,
            headers : {
                'Content-Type': undefined
            },
            params:{
                "func":"refresh",
                "name":myList
            }
        };
        return $http(req).then(function (body) {
            $rootScope.ids = body ;
            $log.info(body);
            refresh_content(body["data"]);
        });
    }

    function insertElement(pro ,order,list,element){
        $log.info("insertElement",list, element);
        // $log.info(list.length);
        var len = list.length;
        if(pro === "default"){
            for (var x = 0; x <= len; x++)
            {
                // $log.info("insert debug",x)
                if (len === x){
                    list.push(element);
                    break;
                }
                else{
                    if (self.name_list.indexOf(element["symbol"]) < self.name_list.indexOf(list[x]["symbol"]))
                    {
                        list.splice(x,0,element);
                        break;
                    }
                }
            }
            return list;
        }else{
            for (var x = 0; x <= len; x++)
            {
                if (x === len){
                    list.push(element);
                }else{
                    if (list[x][pro] > element[pro] && order === "Ascending")
                    {
                        // $log.info(list[x][pro]);
                        list.splice(x,0,element);
                        break;
                    }else if (list[x][pro] < element[pro] && order === "Descending"){
                        list.splice(x,0,element);
                        break;
                    }
                }
            }
            return list;
        }

    }

    function refresh_order(){

        $log.info("refresh_order");
        if (self.pro === "default")
        {
            self.order = "Ascending";
            self.dis = true;
        }else{
            self.dis = false;
        }
        $log.info(self.order, self.pro);
        var tmp = [];
        for (var x in self.favoList)
        {
            $log.info(self.favoList[x])
            tmp = insertElement(self.pro, self.order, tmp, self.favoList[x]);
        }
        self.favoList = tmp;
    }

    function refresh_content(body){
        // $log.info(body[0]);
        // $log.info(typeof (body[0]))
        $log.info("refresh  content")
        var tmp_arr = [];
        var v = 0;
        for (var x in body)
        {
            try{
                var girl = JSON.parse(body[x])
            }catch (e){
                if (e instanceof SyntaxError) {
                    continue;
                }
            }

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
                continue;
            }

            var volume = last["5. volume"];
            var close = last["4. close"];
            var change_price = parseFloat(pre_close) - parseFloat(close);
            var change_percent = Math.abs(change_price / parseFloat(pre_close));
            var change = change_price.toFixed(2).toString() + "(" + change_percent.toFixed(2).toString() + "%)";
            var tmp = {};
            tmp["symbol"] = symbol;
            tmp["change_percent"] = change_percent;
            tmp["change_price"] = change_price;
            tmp["text"] = change;
            tmp["price"] = parseFloat(parseFloat(close).toFixed(2));
            tmp["volume"] = numberWithCommas(volume);
            // $log.info("refresh  content debug")
            // $log.info(self.pro, self.order,self.favoList,tmp);
            v++
            $log.info("list ",v)
            tmp_arr = insertElement(self.pro, self.order,tmp_arr,tmp);
        }
        self.favoList = tmp_arr;

    }

    function mark(){
        if (self.name_list.includes(self.stock_symbol)){
            var index = self.name_list.indexOf(self.stock_symbol);
            delete self.storage[self.stock_symbol];
            self.name_list.splice(index,1);
        }else{
            self.storage[self.stock_symbol] = self.ind_json;
            self.name_list.push(self.stock_symbol);
        }
        self.bookmark = !self.bookmark;
    }



    function showCS(){
        self.cur_stock = true;
        // self.cur_form = false;
        // self.cur_stock_wait = false;
        // self.cur_stock_error = false;
        // self.chart = true;
        // self.indicators_wait = true;
        // self.indicators_error = false;
        self.his_charts = false;
        // self.his_charts_wait = false;
        // self.his_charts_error = false;
        self.sto_news = false;
        // self.sto_news_wait = false;
        // self.sto_news_error = false;


    }
    function showHC(){
        self.cur_stock = false;
        // self.cur_form = false;
        // self.cur_stock_wait = false;
        // self.cur_stock_error = false;
        // self.chart = true;
        // self.indicators_wait = false;
        // self.indicators_error = false;
        self.his_charts = true;
        // self.his_charts_wait = false;
        // self.his_charts_error = false;
        self.sto_news = false;
        // self.sto_news_wait = false;
        // self.sto_news_error = false;
        self.renderHisChart()
    }
    function showNF(){
        self.cur_stock = false;
        // self.cur_form = false;
        // self.cur_stock_wait = true;
        // self.cur_stock_error = false;
        // self.chart = true;
        // self.indicators_wait = true;
        // self.indicators_error = false;
        self.his_charts = false;
        // self.his_charts_wait = false;
        // self.his_charts_error = false;
        self.sto_news = true;
        // self.sto_news_wait = false;
        // self.sto_news_error = false;
    }


    function getQuote()
    {
        self.stock_symbol = $rootScope.stock_symbol.toUpperCase();
        if (self.name_list.includes(self.stock_symbol))
        {
            self.bookmark = false;
        }
        else{
            self.bookmark = true;
        }
        self.price = [];
        self.page = '2';
        showCS();
        self.cur_stock_wait = true;
        self.indicators_wait = true;
        self.news_wait = true;
        self.cur_form = false;
        self.chart = false;
        self.indicators_error = false;
        self.cur_stock_error = false;
        self.his_charts_error = false;
        self.sto_news_error = false;

    }

    function redraw(spec){
        self.pageToRight();
        self.cur_form = true;
        self.wait = false;
        pro_price();
        self.chart = true;
        renderCharts("Price");
    }


    function getInds(){
        self.ind_json = $rootScope.ids;
        self.cur_form = true;
        self.wait = false;
        pro_price();
        self.chart = true;
        renderCharts("Price");
        // $log.info(self.price);


    }

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    function pro_price(){
        self.price = [];
        self.cur_stock_wait = false;

        try{
            var jobj = JSON.parse(self.ind_json["data"]["Price"]);
        }
        catch (e){
            self.cur_form = false;
            self.cur_stock_error = true;
            return;
        }

        $log.info(jobj["Meta Data"]);
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
        self.price["Stock Ticker Symbol"] = symbol;
        self.price["Last Price" ] = parseFloat(close).toFixed(2);
        self.price["Change (Change Percent)"] = change;
        self.price["Timestamp"] = time;
        self.price["Open"] = parseFloat(open).toFixed(2);
        self.price["Previous Close" ] = parseFloat(pre_close).toFixed(2);
        self.price["Daily Range"] = range;
        self.price["Volume"] = numberWithCommas(volume);
        self.price["change_price"] = change_price;
    }


    function pro_news(){
        self.news = [];
        try{
            for (var i = 0; i < 5 && i < self.news_json["data"]["rss"]["channel"][0]["item"].length ; i++)
            {
                var tmp = {"title":self.news_json["data"]["rss"]["channel"][0]["item"][i]["title"].toString(),
                    "pubDate" : self.news_json["data"]["rss"]["channel"][0]["item"][i]["pubDate"].toString(),
                    "link":self.news_json["data"]["rss"]["channel"][0]["item"][i]["link"].toString(),
                    "author":self.news_json["data"]["rss"]["channel"][0]["item"][i]["sa:author_name"].toString()
                };
                // $log.info(tmp);
                self.news.push(tmp);
            }
        }catch (e){
            self.sto_news_error = true;
        }

    }

    function getnews(){
        self.news_json = $rootScope.news;
        $log.info(self.news_json);
        pro_news();
        $log.info(self.news);
    }

    function return_date(date)
    {
        var str = date
        var index = str.indexOf('-');
        var res = "";
        // res += str.substr(0,index) + "/";
        str = str.substr(index + 1);
        index = str.indexOf('-');
        res += str.substr(0,index) + "/";
        res += str.substr(index + 1);
        return res;
    }
    function renderCharts(spec)
    {
        self.spec = spec;
        // $log.info(typeof(self.ind_json["data"][spec]));
        self.indicators_error = false;
        self.indicators_wait = false;
        $log.info("render charts",spec);
        try{
            var jsonobj = JSON.parse(self.ind_json["data"][spec]);
        }catch (e)
        {
            self.tmp_html = '<div class="alert alert-danger" role="alert">\n' +
                'Error! Failed to get '+ spec + ' data.' +
                '</div>';
            self.ind_error_html = $sce.trustAsHtml(self.tmp_html);
            self.chart = false;
            self.indicators_error = true;
            return;
        }
        self.chart = true;
        if(spec === "Price")
        {
            renderPrice(jsonobj)
        }else {
            renderInds(jsonobj,spec);
        }
    }
    function renderPrice(json_obj){
        var price_arr =[];
        var volume_arr = [];
        var date_arr = [];
        var i = 0;
        for (var date_j in json_obj["Time Series (Daily)"])
        {
            if (i > 200) break
            date_arr.unshift(return_date(date_j))
            price_arr.unshift(parseFloat(json_obj["Time Series (Daily)"][date_j]["4. close"]));
            volume_arr.unshift(parseFloat(json_obj["Time Series (Daily)"][date_j]["5. volume"]));
            i++;
        }
        self.share_data = price_arr;
        self.share_date = date_arr;
        self.share_volume = volume_arr;
        var char_title = "Stock Price (" + json_obj["Meta Data"]["3. Last Refreshed"]+ ")";
        self.share_title = char_title;
        var chart1 = Highcharts.chart('chart', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: char_title
            },
            subtitle: {
                text:  '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>'
            },
            xAxis: [{
                categories:date_arr,
                tickInterval:5
            }],
            yAxis: [{ // Primary yAxis
                title: {
                    text: 'Stock Price',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Volume',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: 'Stock Price',
                type: 'area',

                data: price_arr
            }, {
                name: 'Volume',
                type: 'column',
                yAxis: 1,
                data: volume_arr
            }]
        });
    }
    function renderInds(jsonobj,spec){
        var char_title = jsonobj["Meta Data"]["2: Indicator"]
        var data_arr = [];
        var date_arr = [];
        var stock_symbol = $rootScope.stock_symbol;
        var num = 0;
        var indicator_func =spec;
        self.indicator_func = indicator_func;
        for (var ele in jsonobj)
        {
            if (ele === "Meta Data")  continue;
            for (var item in jsonobj[ele])
            {
                for (var ind in jsonobj[ele][item])
                {
                    var dic = { "name" : stock_symbol + " " +ind, "data" : new Array()}
                    data_arr.push(dic);
                }
                break;
            }
        }
        for (var ele in jsonobj) {
            if (ele == "Meta Data") continue;
            for (var item in jsonobj[ele]) {
                if (num++ >= 200) break;
                var j = 0;
                date_arr.unshift(return_date(item))
                for (var ind in jsonobj[ele][item]) {
                    data_arr[j]["data"].unshift(parseFloat(jsonobj[ele][item][ind]));
                    j++;
                }
            }
        }
        self.share_data = data_arr;
        self.share_date = date_arr;
        self.share_title = char_title;
        Highcharts.chart('chart', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: char_title
            },
            subtitle: {
                text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>'
            },
            xAxis: [{
                categories:date_arr,
                tickInterval:5
            }],
            yAxis: [{ // Primary yAxis
                title: {
                    text: indicator_func,
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }
            }],
            plotOptions: {
                series: {
                    marker: {
                        radius:2,
                        enabled: true
                    }
                },
                spline: {
                    marker: {
                        radius:1,
                        enabled: true
                    }
                }
            },
            series: data_arr
        });
    }
    function renderHisChart()
    {
        self.his_charts_error = false;
        $log.info("render his chart");
        var data = [];
        try{
            var jsonobj = JSON.parse(self.ind_json["data"]["Price"]);
        }
        catch (e){
            self.his_charts_charts = false;
            self.his_charts_error = true;
            return;
        }
        var title =  $rootScope.stock_symbol + " Stock Value";
        for (var date_j in jsonobj["Time Series (Daily)"])
        {
            var tmp = [];
            tmp.push(parseInt(Date.parse(date_j)));
            tmp.push(parseFloat(parseFloat(jsonobj["Time Series (Daily)"][date_j]["4. close"]).toFixed(2)));
            data.unshift(tmp);
        }
        $log.info(data);
        self.his_charts_charts = true;
        var chart = Highcharts.stockChart('his_charts', {

            title: {
                text: title
            },

            subtitle: {
                text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>'
            },

            rangeSelector: {
                buttons: [
                    {type: 'week',
                        count: 1,
                        text: '1W'},
                    {
                        type: 'month',
                        count: 2,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 4,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        count:5,
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 6,
                        text: '1y'
                    }, {
                        type: 'all',
                        count:7,
                        text: 'All'
                    }]
            },
            tooltip: {
                split:false
            },
            series: [{
                name: 'AAPL Stock Price',
                data: data,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                }
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            }
        });

    }

}