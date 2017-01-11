"use strict";
// require drop.js

class ImageBinaryViewer {
    constructor(container, imageClassList) {
	this.container = container;
	this.imageClassList = imageClassList;
    }
    reset() {
	var container = this.container;
	for (var node of this.container.childNodes) {
	    container.removeChild(node);
	}
    }
    add(buf) {
	var arr = new Uint8Array(buf);
	var io = null;
	for (var imgClass of this.imageClassList) {
	    if (imgClass.verifySig(arr)) {
		var io = new imgClass();
	    }
	}
	var chunkList = null;
	if (io !== null) {
	    io.parse(arr);
	    chunkList = io.getChunkList();
	    console.debug(chunkList);
	} else {
	    chunkList = [{name:"Unknown Image Type", offset:0, bytes:arr, info:[]}];
	    console.error("Unknown Image Signature:"+ arr.subarray(0, 8).toString());
	}
	var containerNode = this.container;
	//
	var fileNode = document.createElement("div");
	fileNode.className = "imgFile";
	for (var chunk of chunkList) {
	    var chunkNode = document.createElement("div");
	    chunkNode.className = "imgChunk";
	    //
	    var name = chunk.name;
	    var bytes = chunk.bytes;
	    var hexArray = null;
	    var hexDump = "";
	    chunkNode.innerHTML = name;
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
		    var infoNode = document.createElement("div");
		    var dumpNode = document.createElement("div");
		    infoNode.className = "imgInfo";
		    dumpNode.className = "imgDump";
		    var infoBytes = bytes.subarray(offset - chunk.offset, nextOffset - chunk.offset);
		    var infoJson = JSON.stringify(info, null, " ");
		    hexArray = Utils.ToHexArray(infoBytes);
		    hexDump = hexArray.join(" ");
		    infoNode.innerHTML = "<tt>" + infoJson + "</tt>";
		    dumpNode.innerHTML = "<tt>" + hexDump + "</tt>";
		    chunkNode.appendChild(infoNode);
		    chunkNode.appendChild(dumpNode);
		}
	    } else {
		var dumpNode = document.createElement("div");
		dumpNode.className = "imgDump";
		hexArray = Utils.ToHexArray(bytes);
		hexDump = hexArray.join(" ");
		dumpNode.innerHTML = "<tt>" + hexDump + "</tt>";
		chunkNode.appendChild(dumpNode);
	    }
	    fileNode.appendChild(chunkNode);
	}
	containerNode.appendChild(fileNode);
    }
}

