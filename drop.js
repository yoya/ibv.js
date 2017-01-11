"use strict";

var cancelEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

function dropFunction(target, func) {
    var target = (target)?target:document;
    target.addEventListener("dragover" , cancelEvent, false);
    target.addEventListener("dragenter", cancelEvent, false);
    target.addEventListener("drop"     , function(e) {
        e.preventDefault();
	func(null);
	var files = e.dataTransfer.files;
	for (var i = 0; i < files.length; i++) {
	    var file = files[i];
	    var reader = new FileReader();
            reader.onload = function(evt) {
		var buf = evt.target.result;
		func(buf);
            }
            reader.readAsArrayBuffer(file);
	}
        return false;
    }, false);
}
