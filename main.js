"use strict";

function getById(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    dropFunction("ibv", onImgLoad);
}

 /*
  * buffer: ArrayBuffer
  */
function onImgLoad(buf) {
    var arr = new Uint8Array(buf);
    console.log(arr);
}


