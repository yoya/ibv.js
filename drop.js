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
	var reader = new FileReader();
        reader.onload = function (evt) {
	    var buf = evt.target.result;
	    func(buf, userData);
        }
        reader.readAsArrayBuffer(e.dataTransfer.files[0]);
        return false;
    }, false);
}
