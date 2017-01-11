"use strict";

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    var container = document.getElementById("ibv_container");
    var ibvC = new ibvContainer(container);
    dropFunction(onImgLoad, null, ibvC);
}

/*
 * buffer: ArrayBuffer
 */

function onImgLoad(buf, ibvC) {
    if (buf === null) {
	ibvC.reset();
	return ;
    }
    var arr = new Uint8Array(buf);
    var io = null;
    for (var imgClass of [IO_JPEG, IO_PNG, IO_GIF]) {
	if (imgClass.verifySig(arr)) {
	    var io = new imgClass();
	}
    }
    var cArr = null;
    if (io !== null) {
	io.parse(arr);
	cArr = io.getChunkArray();
	console.log(cArr);
    } else {
	cArr = [{name:"Unknown Image Type", offset:0, bytes:arr, info:[]}];
	ibvC.add(cArr);
	console.error("Unknown Image Signature:"+ arr.subarray(0, 8).toString());
    }
    ibvC.add(cArr);
}
