"use strict";

/*
  2017/01/05- yoya@awm.jp
*/

function dropFunction(target, func) {
    var target = (target)?target:document;
    var cancelEvent = function(e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
    };
    var dropEvent = function(e) {
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
    }
    target.addEventListener("dragover" , cancelEvent, false);
    target.addEventListener("dragenter", cancelEvent, false);
    target.addEventListener("drop"     , dropEvent, false);
}
