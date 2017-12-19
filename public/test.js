'use strict';
angular.module('test',["ng","ngAnimate","ngAria",'ngMaterial', 'ngMessages']);

angular.module('test').controller('ss',function($log,$http){
    var self = this;

    self.date = "2017-11-15";
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
});
