"use strict";

var cancelEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

function dropFunction(id, func) {
    // var elem = document;
    document.addEventListener("dragover" , cancelEvent, false);
    document.addEventListener("dragenter", cancelEvent, false);
    document.addEventListener("drop"     , function(e) {
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
