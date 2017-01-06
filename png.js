"use strict";

class IO_PNG {
    constructor() { ; }
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
	var chunkArray = [];
	var arrLen = arr.length;
	var bo = 8; //bo: byteOffset(& baseOffset);
	var bytes;
	while (bo < arrLen) {
	    var len = ((arr[bo]*0x100 + arr[bo+1])*0x100 + arr[bo+2])*0x100 + arr[bo+3];
	    var name = Utils.toText(arr.subarray(bo + 4, bo + 8));
	    var o = bo + 8 + len;
	    var chunk = {name:name, offset:bo, bytes:null, crc32:null, infos:null};
	    var infos = [{offset:bo, len:len}];
	    infos.push({offset:bo+4, name:name});
	    bytes = arr.subarray(bo, o);
	    chunk.bytes = bytes;
	    chunk.infos = infos;
	    infos.push({offset:bo+8, nBytes:bytes.length - 8});
	    var crc32  = ((arr[o]*0x100 + arr[o+1])*0x100 + arr[o+2])*0x100 + arr[o+3];
	    chunk.crc32 = crc32;
	    infos.push({offset:bo+8+len, crc32:crc32});
	    bo = o + 4;
	    chunkArray.push(chunk);
	    if (name  === "IEND") {
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
