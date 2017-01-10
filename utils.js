"use strict";

var Utils = {};

Utils.ToText = function (arr) {
    return String.fromCharCode.apply(null, arr);
};

Utils.ToHex = function(n) {
    var h = n.toString(16);
    return (n < 0x10)? ("0"+h) : h;
};

Utils.ToHexArray = function(arr) {
    var hexArr = new Array(arr.length);
    for (var i in arr) {
	hexArr[i] =  Utils.ToHex(arr[i]);
    }
    return hexArr;
};
