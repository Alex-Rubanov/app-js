const fs = require("fs");
const zlib = require("zlib");

function gzip(filename, callback) {
  // Utworzenie strumieni.
  let source = fs.createReadStream(filename);
  let destination = fs.createWriteStream(filename + ".gz");
  let gzipper = zlib.createGzip();

  // Utworzenie potoku.
  source
    .on("error", callback)       // Wywołanie funkcji zwrotnej w przypadku błędu odczytu.
    .pipe(gzipper)
    .pipe(destination)
    .on("error", callback)       // Wywołanie funkcji zwrotnej w przypadku błędu zapisu.
    .on("finish", callback);     // Wywołanie funkcji zwrotnej po zakończeniu operacji.
}
