"use strict";

var Utils = {};

Utils.ToText = function (arr) {
    return String.fromCharCode.apply("", arr);
};

Utils.ToHexArray = function(arr) {
    var hexArr = new Array(arr.length);
    for (var i in arr) {
	var n = arr[i];
	var h = n.toString(16);
	if (n < 0x10) {
	    h = "0" + h;
	}
	hexArr[i] = h;
    }
    return hexArr;
};
