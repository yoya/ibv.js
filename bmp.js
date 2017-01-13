"use strict";

/*
  2017/01/14- yoya@awm.jp
  ref)
  - https://msdn.microsoft.com/en-us/library/dd183374(VS.85).aspx
*/

class IO_BMP {
    constructor() {
	this.binary = new Binary("LittleEndian");
    }
    static signature() {
	return [0x42, 0x4d]; // "BM"
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
	var sigArr = arr.subarray(0, 2);
	var signature = Utils.ToText(sigArr);
	var chunk = {name:"Bitmap File Header", offset:0,
		     bytes:arr.subarray(0, 14), infos:null};
	var chunkList = [];
	var bytes = null, infos = [];
	infos.push({offset:0, signature:signature});
	var fileSize =  this.binary.readUint32(arr, 2);
	infos.push({offset:2, fileSize:fileSize});
	var offsetToPixelArray =  this.binary.readUint32(arr, 10);
	infos.push({offset:10, offsetToPixelArray:offsetToPixelArray});
	chunk.infos = infos;
	chunkList.push(chunk);
	// 
	var chunk = {name:"DIB Header (BMPv5)", offset:14,
		     bytes:null, infos:null};
	var bytes = null, infos = [];
	var dibHeaderSize =  this.binary.readUint32(arr, 14);
	infos.push({offset:14, dibHeaderSize:dibHeaderSize});
	infos.push({offset:18, width:this.binary.readUint32(arr, 18)});
	infos.push({offset:26, planes:this.binary.readUint16(arr, 26)});
	infos.push({offset:28, bitPerPixel:this.binary.readUint16(arr, 28)});
	infos.push({offset:30, compression:this.binary.readUint32(arr, 30)});
	infos.push({offset:34, imageSize:this.binary.readUint32(arr, 34)});
	infos.push({offset:38, xPixelsPerMeter:this.binary.readUint32(arr, 38)});
	infos.push({offset:42, yPixelsPerMeter:this.binary.readUint32(arr, 42)});
	infos.push({offset:46, colorsInColorTable:this.binary.readUint32(arr, 46)});
	infos.push({offset:50, importantColorCount:this.binary.readUint32(arr, 50)});
	
	chunk.bytes = arr.subarray(14, 14 + dibHeaderSize);
	chunk.infos = infos;
	chunkList.push(chunk);
	//
	this.chunkList = chunkList;
    }
    getChunkList() {
	return this.chunkList;
    }
    build() {
	;
    }
}
