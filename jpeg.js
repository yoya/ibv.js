"use strict";

class IO_JPEG {
    constructor() { ; }
    static signature() {
	return [0xFF, 0xD8, 0xFF, 0xE0]; // SOI,APP0(JFIF-JPEG)
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
	var bo = 0; //bo: byteOffset(& baseOffset);
	var bytes;
	while (bo < arrLen) {
	    var marker1 = arr[bo];
	    if (marker1 !== 0xFF) {
		console.debug("marker1(0xFF) scan skipping :"+marker1);
		bo++;
		continue;
	    }
	    var marker2 = arr[bo + 1];
	    var o = bo + 2;
	    var chunk = {marker2:marker2, offset:bo, bytes:null};
	    switch (marker2) {
	    case 0xD8: case 0xD9: // SOI, EOI
		bytes = arr.subarray(bo, o);
		break;
	    case 0xDA: // SOS
	    case 0xD0: case 0xD1: case 0xD2: case 0xD3: // RST0 - RST3
            case 0xD4: case 0xD5: case 0xD6: case 0xD7: // RST4 - RST7
		for ( ; o < arrLen ; o++) {
		    if (arr[o] === 0xFF) {
			if (arr[o+1] != 0x00) {
			    break;
			}
			o++;
		    }
		}
		bytes = arr.subarray(bo, o);
		break;
	    default: // APPx, SOFx, DQT, DHT, ...
		var len = 0x100*arr[bo + 2] + arr[bo + 3]; // Big endian
		o += len
		bytes = arr.subarray(bo, o);
		break;
	    }
	    bo = o;
	    chunk.bytes = bytes;
	    chunkArray.push(chunk);
	    if (marker2 === 0xD9) { // EOF
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
