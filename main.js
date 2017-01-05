"use strict";

function getById(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    var container = document.getElementById("ibv_container");
    console.log(container);
    var ibvC = new ibvContainer(container);
    dropFunction(onImgLoad, null, ibvC);
}

 /*
  * buffer: ArrayBuffer
  */

function onImgLoad(buf, ibvC) {
    var arr = new Uint8Array(buf);
    var io = null;
    for (var imgClass of [IO_JPEG]) {
	console.log(imgClass);
	if (imgClass.verifySig(arr)) {
	    var io = new imgClass();
	}
    }
    if (io !== null) {
	console.log(io);
	io.parse(arr);
	var cArr = io.getChunkArray();
	console.log(cArr);
	ibvC.add(cArr);
    } else {
	console.error("Unknown Image Signature:"+ arr.subarray(0, 8).toString());
    }
}
