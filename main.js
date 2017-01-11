"use strict";

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    var container = document.getElementById("ibv_container");
    var ibviewer = new ImageBinaryViewer(container, [IO_JPEG, IO_PNG, IO_GIF]);
    dropFunction(null, function(buf) {
	if (buf === null) {
	    ibviewer.reset();
	} else {
	    ibviewer.add(buf);
	}
    });
}


