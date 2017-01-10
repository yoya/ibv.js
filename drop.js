"use strict";

var cancelEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

function dropFunction(func, target, userData) {
    var target = (target)?target:document;
    target.addEventListener("dragover" , cancelEvent, false);
    target.addEventListener("dragenter", cancelEvent, false);
    target.addEventListener("drop"     , function(e) {
        e.preventDefault();
	func(null, userData);
	for (var file of e.dataTransfer.files) {
	    var reader = new FileReader();
            reader.onload = function (evt) {
		var buf = evt.target.result;
		func(buf, userData);
            }
            reader.readAsArrayBuffer(file);
	}
        return false;
    }, false);
}
