"use strict";

class IO_GIF {
    constructor() { ; }
    static signature() {
	return [0x47, 0x49, 0x46]; // "GIF"
    }
    separatorName(separator) {
	var separatorTable = {
	    0x21:'Extension',
	    0x2C:'Image',
	    0x3B:'Trailer'
	};
	if (separator in separatorTable) {
	    return separatorTable[separator];
	}
	return "(unknown)";
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
    static toText(arr) {
	return String.fromCharCode.apply("", arr);
    }
    parse(arr) {
	this.data = arr;
	var chunk = {name:"Signature", offset:0,
		     bytes:this.constructor.signature()};
	var chunkArray = [chunk];
	var arrLen = arr.length;
	var versionArr = arr.subarray(3, 6);
	this.version = this.constructor.toText(versionArr);
	chunkArray.push({name:"Version", offset:6, bytes:versionArr,
			 infos:[{offset:6, versiont:this.version}]});
	// Logical Screen Descriptor
	var sWidth  = arr[6] + 0x100*arr[7];
	var sHeight = arr[8] + 0x100*arr[9];
	chunkArray.push({name:"LogicalScreenDescriptor",
			 offset:6, bytes:arr.subarray(6, 10),
			 infos:[{offset:6, width:sWidth},
				{offset:8, height:sHeight}]});
	var tmp = arr[10];
	var globalColorTableFlag   = (tmp >>> 7) & 0x1;
	var colorResolution        = (tmp >>> 4) & 0x3;
	var sortFlag               = (tmp >>> 3) & 0x1;
	var sizeOfGlobalColorTable = (tmp >>> 0) & 0x3;
	colorResolution = colorResolution + 1,
	sizeOfGlobalColorTable = Math.pow(2, sizeOfGlobalColorTable+1);
	var backgroundColorIndex = arr[11];
	var pixelAspectRatio = arr[12];
	
	chunkArray.push({name:"GlobalDesripctor", offset:10, bytes:arr.subarray(10, 11),
		 infos:[{offset:10,
			 globalColorTableFlag:globalColorTableFlag,
			 colorResolution:colorResolution,
			 sortFlag:sortFlag,
			 sizeOfGlobalColorTable:sizeOfGlobalColorTable},
			{offset:11, backgroundColorIndex:backgroundColorIndex},
			{offset:12, pixelAspectRatio:pixelAspectRatio}]
			});
	var bo = 13;
	var o = bo;
	if (globalColorTableFlag) {
	    var globalColorTable = new Uint8Array(3 * sizeOfGlobalColorTable);
	    for (var i = 0 ; i < 3 * sizeOfGlobalColorTable ; i++) {
		globalColorTable[i] = arr[o];
		o++;
	    }
	    chunk = {name:"GlobalColorTable", offset:bo,
		     bytes:arr.subarray(bo, o),
		     infos:[{offset:bo,
			     globalColorTable:globalColorTable}]};
	    chunkArray.push(chunk);
	    bo = o;
	}
	var trail = false;
	while ((bo < arrLen) && (trail === false)) {
	    var separator = arr[bo];
	    var name = this.separatorName(separator);
	    chunk = {name:name, offset:bo, bytes:null, infos:null};
	    var infos = [{offset:bo, separator:separator}];
	    switch (separator) {
	    case 0x3B:  // Trailer (End of GIF Data Stream)
		o = bo + 1;
		trail = true;
		break;
	    case 0x21: // Extension Separator
		var extensionBlockLabel = arr[bo + 1];
		var extentionDataSize =  arr[bo + 2];
		infos.push({offset:bo + 1,
			    extensionBlockLabel:extensionBlockLabel});
		if (extentionDataSize === 0) {
		    break; // no data
		}
		o = bo + 3;
		switch (extensionBlockLabel) {
		case 0xF9: // Graphics Control
		    var tmp = arr[o];
		    var disposalMethod      = (tmp >>> 2) & 0x3;
		    var userInputFlag       = (tmp >>> 1) & 0x1;
		    var transprentColorFlag = (tmp >>> 0) & 0x1;
		    var delayTime =  arr[o+1] + 0x100*arr[o+2];
		    var transparentColorIndex = arr[o+3];
		    infos.push({offset:o,
				disposalMethod:disposalMethod,
				userInputFlag:userInputFlag,
				transprentColorFlag},
			       {offset:o+1, delayTime:delayTime},
			       {offset:o+3, transparentColorIndex});
		    break;
		case 0xFE: // Comment Extention
		    var commentData = this.constructor.toText(arr.subarray(o, o + extentionDataSize));
		    break;		    
		case 0xFF: // Application Extension
		    var applicationIdentifier = this.constructor.toText(arr.subarray(o, o + 8))
		    var applicationAuthenticationCode = this.constructor.toText(arr.subarray(o + 8, o + 12));
		    infos.push({offset:o,
				applicationIdentifier:applicationIdentifier},
			       {offset:o+8,
				applicationAuthenticationCode:applicationAuthenticationCode});
		    o += 12;
		    var aoffset = o;
		    var applicationData = [];
		    while (true) {
			var blockSize = arr[o];
			if (blockSize === 0) {
			    o--; // extensionBlockTrailer
			    break;
			}
			applicationData = applicationData.concat(arr.subarray(o+1, o+1+blockSize));
			o += 1 + blockSize;
		    }
		    infos.push({offset:aoffset,
				applicationData:applicationData});
		    break;
		default:
		    console.error("unknown extention block label:"+extensionBlockLabel);
		    break;
		}
		var extensionBlockTrailer = arr[o + extentionDataSize];
		o += extentionDataSize + 1;
	        break;
	    case 0x2C: // Image Separator
		var left   = arr[bo + 1] + 0x100*arr[bo + 2];
		var top    = arr[bo + 3] + 0x100*arr[bo + 4];
		var width  = arr[bo + 5] + 0x100*arr[bo + 6];
		var height = arr[bo + 7] + 0x100*arr[bo + 8];
		var tmp = arr[bo + 9];
		var localColorTableFlag   = (tmp >>> 7) & 0x1;
		var interlaceFlag         = (tmp >>> 6) & 0x1;
		var sortFlag              = (tmp >>> 5) & 0x1;
		var sizeOfLocalColorTable = (tmp >>> 0) & 0x3;
		sizeOfLocalColorTable = Math.pow(2, sizeOfLocalColorTable+1);
		infos.push({offset:bo+1, left:left},
			   {offset:bo+3, top:top},
			   {offset:bo+5, width:width},
			   {offset:bo+7, height:height},
			   {offset:bo+9,
			    localColorTableFlag:localColorTableFlag,
			    interlaceFlag:interlaceFlag,
			    sortFlag:sortFlag,
			    sizeOfLocalColorTable:sizeOfLocalColorTable});
		o = bo + 10;
		if (localColorTableFlag) {
		    var localColorTable = new Uint8Array(3 * sizeOfLocalColorTable);
		    for (var i = 0 ; i < 3 * sizeOfLocalColorTable ; i++) {
			localColorTable[i] = arr[o];
			o++;
		    }
		    infos.push({offset:bo+10,
				localColorTable:localColorTable});
		}
		var lzwMinimumCodeSize = arr[o];
		infos.push({offset:o,
			    localColorTable:localColorTable});
		o += 1;
		var ioffset = o;
		//var imageData = new Uint8Array(0);
		var imageData = [];
		while (true) {
		    var blockSize = arr[o];
		    if (blockSize === 0) {
			o++;
			break;
		    }
		    imageData = imageData.concat(arr.subarray(o+1, o+1+blockSize));
		    o += 1 + blockSize;
		}
		infos.push({offset:ioffset, imageData:imageData});
		break;
	    default:
		console.error("unknown separator:"+separator);
		trail = true;
		break;
	    }
	    chunk.bytes = arr.subarray(bo, o);
	    chunk.infos = infos;
	    chunkArray.push(chunk);
	    bo = o;
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
    