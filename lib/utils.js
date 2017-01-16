"use strict";

/*
  2017/01/06- yoya@awm.jp
*/

var Utils = {};

Utils.ToText = function (arr) {
    return String.fromCharCode.apply(null, arr);
};

Utils.ToHex = function(n, digit) {
    var h = n.toString(16);
    if (digit === undefined || digit <= 1) {
	digit = 2;
    }
    return "0".repeat(digit - h.length) + h;
};

Utils.ToHexArray = function(arr) {
    var hexArr = new Array(arr.length);
    for (var i in arr) {
	hexArr[i] =  this.ToHex(arr[i]);
    }
    return hexArr;
};
