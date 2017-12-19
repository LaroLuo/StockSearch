angular.module('hw8').controller('InputCtrl',InputCtrl);

function InputCtrl ($scope, $log, $http, $rootScope) {
    var self = this;
    // list of `state` value/display objects
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.click = click;
    self.reset = reset;
    // self.getSelectedItem = getSelectedItem;
    self.states = {};
    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */

    function reset()
    {
        $rootScope.$emit("reset", {});
    }


    function callIndicators(apiurl, name)
    {
        var req = {
            method : "GET",
            url : apiurl,
            headers : {
                'Content-Type': undefined
            },
            params:{
                "func":"indicators",
                "name":name
            }
        };
        return $http(req).then(function (body) {
            $rootScope.ids = body ;
            $log.info(body);
            $rootScope.$emit("get_inds", {});
        });
    }
    function callNews(apiurl, name){

        var req = {
            method : "GET",
            url :  apiurl,
            headers : {
                'Content-Type': undefined
            },
            params:{
                "func":"news",
                "name":name
            }
        };
        return $http(req).then(function (body) {
            $rootScope.news = body;
            $log.info(body);
            $rootScope.$emit("get_news", {});
        });

    }
    function click()
    {
        $scope.i = 2;
        $log.info("click quote");
        // var apiurl = "http://ruiluo.site/api";
        let apiurl = "http://hw8-envv.us-west-1.elasticbeanstalk.com/api";
        // var apiurl = "http://localhost:3000/api"
        let name = self.searchText;
        $rootScope.stock_symbol = name.toUpperCase();
        $log.info($rootScope.stock_symbol);
        $rootScope.$emit("get_quote", {});
        callIndicators(apiurl, name);
        callNews(apiurl, name);
    }
    function querySearch(query) {
        $log.info("---------------------querySearch -------------------------")
        // const autocompleted_query = "http://localhost:3000/api?func=autocomplete&name="+query;
        const autocompleted_query = "http://hw8-envv.us-west-1.elasticbeanstalk.com/api?func=autocomplete&name="+query;
        $log.info("api-call-autoCompleted -  " + autocompleted_query);
        return $http.get(autocompleted_query).then(function(response){
                // $log.info(response);
                self.states = loadAll(response);
                $log.info("self.states - " + self.states);
                return self.states;
            }, function(response) {
                $log.info("---------api-call-error-------");
                $log.info(response);
                $log.info("---------api-call-error-------");
                return self.states;

            }
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        );
    }

    function searchTextChange(item) {
        // $log.info("---------------------searchTextChange -------------------------");
        // if (self.searchText !== null && !self.searchText.replace(/\s/g, '').length)
        // {
        //     this.checked = true;
        // }else
        // {
        //     this.checked = false;
        // }

        $log.info("text change to "+ item);
    }

    function selectedItemChange(item) {
        $log.info("---------------------selectedItemChange -------------------------")
        // try {
        //
        // }
        // finally {
        //     $log.info("nothing change");
        //
        // }
        if (self.selectedItem != null)
        {
            var str = item.substring(0, item.indexOf('-') - 1);
            self.searchText = str;
        }
        $log.info("selected-item - "+ item);
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll(resp) {
        $log.info(resp);
        // $log.info(typeof(resp["data"]["body"]));
        var allStates = [];
        var jobj = resp["data"]
        for (var i in jobj)
        {

            allStates.push(jobj[i]["Symbol"] + " - " +jobj[i]["Name"] + " (" + jobj[i]["Exchange"] + ")");
        }
        // $log.info(allStates);
        return allStates.map(function (state) {
            return {
                value: state.substring(0,state.indexOf('-') - 1),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
}