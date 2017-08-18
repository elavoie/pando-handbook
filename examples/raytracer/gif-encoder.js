#!/usr/bin/env node

const readline = require('readline');
const GifEncoder = require('gif-encoder');
const fs = require('fs');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var gif;

function writeGIF(pixels) {

    if (gif == null) {
        let dimen = Math.sqrt(pixels.length / 4); //only square images for now
        gif = new GifEncoder(dimen, dimen);
        let file = fs.createWriteStream('img.gif');
        gif.pipe(file);

        gif.setRepeat(0);
        gif.writeHeader();
    }

    // Write out the image into memory
    gif.addFrame(pixels);
}

rl.on('line', line => {
    let pixels = line.replace(" ", "").split(",");
    writeGIF(pixels);
})

rl.on('close', () => {
    console.log("GIF written successfully.");
    gif.finish();
})
