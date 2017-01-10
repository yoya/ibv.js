"use strict";

class ibvContainer {
    constructor(container) {
	// console.debug(container);
	this.container = container;
    }
    reset() {
	var divContainer = this.container;
	for (var node of divContainer.childNodes) {
	    divContainer.removeChild(node);
	}
    }
    add(chunkList) {
	var divContainer = this.container;
	//
	var divFile = document.createElement("div");
	divFile.className = "imgFile";
	for (var chunk of chunkList) {
	    var divChunk = document.createElement("div");
	    divChunk.className = "imgChunk";
	    //
	    var name = chunk.name;
	    var bytes = chunk.bytes;
	    var hexArray = null;
	    var hexDump = "";
	    divChunk.innerHTML = name;
	    if ("infos" in chunk) {
		if (chunk.offset < chunk.infos[0].offset) {
		    console.error("chunk.offset:"+ chunk.offset+"< chunk.infos[0].offset:"+chunk.infos[0].offset+" on "+name);
		}
		for (var idx in chunk.infos) {
		    idx = idx >>> 0;
		    var info = chunk.infos[idx];
		    var offset = info.offset;
		    if ((idx + 1) < chunk.infos.length) {
			var nextOffset = chunk.infos[idx + 1].offset;
		    } else {
			var nextOffset = chunk.offset + bytes.length;
		    }
		    var divInfo = document.createElement("div");
		    var divDump = document.createElement("div");
		    divInfo.className = "imgInfo";
		    divDump.className = "imgDump";
		    var infoBytes = bytes.subarray(offset - chunk.offset, nextOffset - chunk.offset);
		    var infoJson = JSON.stringify(info, null, " ");
		    hexArray = Utils.toHexArray(infoBytes);
		    hexDump = hexArray.join(" ");
		    divInfo.innerHTML = "<tt>" + infoJson + "</tt>";
		    divDump.innerHTML = "<tt>" + hexDump + "</tt>";
		    divChunk.appendChild(divInfo);
		    divChunk.appendChild(divDump);
		}
	    } else {
		var divDump = document.createElement("div");
		divDump.className = "imgDump";
		hexArray = Utils.toHexArray(bytes);
		hexDump = hexArray.join(" ");
		divDump.innerHTML = "<tt>" + hexDump + "</tt>";
		divChunk.appendChild(divDump);
	    }
	    divFile.appendChild(divChunk);
	}
	divContainer.appendChild(divFile);
    }
}
