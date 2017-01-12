"use strict";

/*
  2017/01/06- yoya@awm.jp
  ref)
  - https://www.w3.org/TR/PNG/
  - http://www.libpng.org/pub/png/spec/
*/

class IO_TIFF {
    constructor() {
	this.binary = null;new Binary("BigEndian");
    }
    static signature() { // "II", "MM"
	return [[0x49, 0x49], [0x4d, 0x4d]];
    }
    getIFDNameTable() {
        var IFDNameTable = {
            0x8825:'GPSInfo',
            0x8769:'Exif',
            0xA005:'Interoperability',
	};
        return IFDNameTable;
    }
    getIFDName(tagId) {
        var table = this.getIFDNameTable();
	if (tagId in table) {
	    return table[tagId];
	}
	return "(unknown)";
    }
    static verifySig(arr) {
	var sigList = this.signature();
	if (arr.length < sigList[0].length) {
	    return false; // too short
	}
	var i = 0, n;
	for (var sig of sigList) {
	    console.log("sig:"+sig);
	    for (i = 0, n = sig.length ; i < n ; i++) {
		console.log("arr[i]"+arr[i]);
		if (arr[i] !== sig[i]) {
		    break; // different value found
		}
	    }
	    if (i === n) {
		return true;  // completely matching
	    }
	}
	return false; // no match
    }
    parse(arr) {
	var sigArr = arr.subarray(0, 2);
	var endian = Utils.ToText(sigArr); // "II" or "MM"
	this.binary = new Binary(endian);
	var chunk = {name:"Endian", offset:0, bytes:sigArr,
		     infos:[{offset:0, endian:endian}]};
	this.chunkList = [chunk];
	var version = this.binary.readUint16(arr, 2);
	this.chunkList.push({name:"Version", offset:2, bytes:arr.subarray(2, 4),
			infos:[{offset:2, version:version}]});
	var ifd0thPointer = this.binary.readUint32(arr, 4);
	this.chunkList.push({name:"0thIFDPointer", offset:4, bytes:arr.subarray(4, 8),
			infos:[{offset:4, IFD0thPointer:ifd0thPointer}]});
	// IFD procedure
	var o = this.parseIFD(arr, ifd0thPointer, "0thIFD");

	var ifd1thPointer = this.binary.readUint32(arr, o);
	this.chunkList.push({offset:o, name:"1thIFDPointer", bytes:arr.subarray(o, o+4),
			     infos:[{offset:o, IFD1thPointer:ifd1thPointer}]});
	if (ifd1thPointer > 0) {
	    this.parseIFD(arr, ifd1thPointer, "1thIFD");
	}
	// chunk sort by offset
	this.chunkList.sort(function (a, b) {
	    var ao = a.offset;
	    var bo = b.offset;
	    if (ao < bo) {
		return -1;
	    } else if (ao > bo) {
		return 1;
	    }
	    return 0;
	});
    }
    parseIFD(arr, bo, name) {
	var ifdNameTable = this.getIFDNameTable();
	var infos = [];
	var nTags = this.binary.readUint16(arr, bo);
	var nBytes = 2 + 12 * nTags + 4; // nTags + Tag x 4 + IFD1Pointer
	var chunk = {offset:bo, name:name, bytes:null, infos:null};
	infos.push({offset:bo, nTags:nTags});
 	var o = bo + 2;
	for (var i = 0 ; i < nTags ; i++) {
	    var tagNo = this.binary.readUint16(arr, o);
	    var tagType = this.binary.readUint16(arr, o + 2);
	    var tagCount = this.binary.readUint32(arr, o + 4);
	    var tagOffset = this.binary.readUint32(arr, o + 8);
	    infos.push({offset:o, tagNo:Utils.ToHex(tagNo), tagType:tagType,
			tagCount:tagCount, tagOffset:tagOffset});
	    if (tagNo in ifdNameTable) {
		this.parseIFD(arr, tagOffset, ifdNameTable[tagNo]);
	    }
	    o += 12;
	}
	chunk.bytes = arr.subarray(bo, bo + nBytes);
	chunk.infos = infos;
	this.chunkList.push(chunk);
	return o;
    }
    getChunkList() {
	return this.chunkList;
    }
}
