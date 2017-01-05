"use strict";

class ibvContainer {
    constructor(container) {
	// console.debug(container);
	this.container = container;
    }
    static toHexArray(arr) {
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
    }
    add(chunkList) {
	var divContainer = document.createElement("div");
	divContainer.className = "imgContainer";
	for (var chunk of chunkList) {
	    var div = document.createElement("div");
	    div.className = "imgChunk";
	    //
	    var bytes = chunk.bytes;
	    var hexArray = this.constructor.toHexArray(bytes);
	    var hexDump = hexArray.join(" ");
	    // console.log(hexDump);
	    div.innerHTML = hexDump;
	    divContainer.appendChild(div);
	}
	this.container.appendChild(divContainer);
    }
}
