"use strict";

var cancelEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

function dropFunction(id, func, elem) {
    var elem = (elem)?elem:document;
    elem.addEventListener("dragover" , cancelEvent, false);
    elem.addEventListener("dragenter", cancelEvent, false);
    elem.addEventListener("drop"     , function(e) {
        e.preventDefault();
	var reader = new FileReader();
        reader.onload = function (evt) {
	    var buf = evt.target.result;
	    func(buf);
        }
        reader.readAsArrayBuffer(e.dataTransfer.files[0]);
        return false;
    }, false);
}
