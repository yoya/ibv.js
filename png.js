"use strict";

class IO_PNG {
    constructor() {
	this.binary = new Binary("BigEndian");
    }
    static signature() { // "\x89PNG\r\n^Z\n"
	return [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    }
    static verifySig(arr) {
	var sig = this.signature();
	if (arr.length < sig.length) {
	    return false; // too short
	}
	for (var i = 0, n = sig.length ; i < n ; i++) {
	    if (arr[i] !== sig[i]) {
		return false; // different value found
	    }
	}
	return true; // completely matching
    }
    parse(arr) {
	this.data = arr;
	var chunk = {name:"Signature", offset:0, bytes:this.constructor.signature()};
	var chunkArray = [chunk];
	var arrLen = arr.length;
	var bo = 8; //bo: byteOffset(& baseOffset);
	var bytes;
	while (bo < arrLen) {
	    var len = this.binary.readUint32(arr, bo);
	    var type = Utils.ToText(arr.subarray(bo + 4, bo + 8));
	    var chunk = {name:type, offset:bo, bytes:null, crc32:null, infos:null};
	    var infos = [{offset:bo, len:len}];
	    infos.push({offset:bo+4, type:type});
	    var o = bo + 8;
	    if (0 < len) {
		switch (type) {
		case "IHDR":
		    var width = this.binary.readUint32(arr, o);
		    var height = this.binary.readUint32(arr, o+4);
		    var bitDepth = arr[o+8];
		    var colourType = arr[o+9];
		    var compressionMethod = arr[o+10];
		    var filterMethod = arr[o+11];
		    var interlaceMethod = arr[o+12];
		    infos.push({offset:o, width:width});
		    infos.push({offset:o+4, height:height});
		    infos.push({offset:o+8, bitDepth:bitDepth});
		    infos.push({offset:o+9, colourType:colourType});
		    infos.push({offset:o+10, compressionMethod:compressionMethod});
		    infos.push({offset:o+11, filterMethod:filterMethod});
		    infos.push({offset:o+12, interlaceMethod:interlaceMethod});
		    break;
		default:
		    infos.push({offset:o, nBytes:len});
		    break;
		}

	    }
	    o = bo + 8 + len;
	    var crc32  = this.binary.readUint32(arr, o);
	    chunk.crc32 = crc32;
	    infos.push({offset:o, crc32:crc32});
	    o += 4;
	    bytes = arr.subarray(bo, o);
	    bo = o;
	    chunk.bytes = bytes;
	    chunk.infos = infos;
	    chunkArray.push(chunk);
	    if (type  === "IEND") {
		break;
	    }
	}
	this.chunkArray = chunkArray;
	return 
    }
    getChunkArray() {
	return this.chunkArray;
    }
    build() {
	;
    }
}
