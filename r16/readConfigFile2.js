const util = require("util");
const fs = require("fs");  // Import modułu odsługującego system plików.
const pfs = {              // Oparte na promesach odmiany funkcji wykonujące operacje na plikach.
  readFile: util.promisify(fs.readFile)
};

function readConfigFile(path) {
  return pfs.readFile(path, "utf-8").then(text => {
    return JSON.parse(text);
  });
}
