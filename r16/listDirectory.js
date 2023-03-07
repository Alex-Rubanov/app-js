const fs = require("fs");
const path = require("path");

async function listDirectory(dirpath) {
    let dir = await fs.promises.opendir(dirpath);
    for await (let entry of dir) {
        let name = entry.name;
        if (entry.isDirectory()) {
            name += "/";  // Dodanie ukośnika na końcu nazwy katalogu.
        }
        let stats = await fs.promises.stat(path.join(dirpath, name));
        let size = stats.size;
        console.log(String(size).padStart(10), name);
    }
}
