var signatureTable = {
    'jpeg':[0xFF, 0xD8, 0xFF, 0xE0], // SOI,APP0(JFIF-JPEG)
    'gif':[0x47, 0x49, 0x46, 0x38], // "GIF8*"
    'png':[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // "\x89PNG\r\n^Z\n"
};

IO_Image.verifySig(arr) {
    
}
