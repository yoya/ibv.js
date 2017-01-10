"use strict";

class Binary {
    constructor(byteOrder) {
	this.setByteOrder(byteOrder);
    }
    setByteOrder(byteOrder) {
	switch(byteOrder) {
	case "MM": case "BigEndian":
	    this.readUint16 = this.readUint16BigEndian;
	    this.readUint32 = this.readUint32BigEndian;
	    break;
	case "II": case "LittleEndian":
	    this.readUint16 = this.readUint16LittleEndian;
	    this.readUint32 = this.readUint32LittleEndian;
	}
    };
    readUint16BigEndian(arr, offset) {
	return arr[offset]*0x100 + arr[offset+1];
    }
    readUint32BigEndian(arr, offset) {
	return ((arr[offset]*0x100 + arr[offset+1])*0x100 + arr[offset+2])*0x100 + arr[offset+3];
    }
    // Little Endian
    readUint16LittleEndian(arr, offset) {
	return arr[offset] + 0x100 * arr[offset+1];
    }
    readUint32LittleEndian(arr, offset) {
	return arr[offset] + 0x100*(arr[offset+1] + 0x100*(arr[offset+2] + 0x100*arr[offset+3]));
    }
}

