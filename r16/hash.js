const fs = require("fs");
const crypto = require("crypto");

// Funkcja wyliczająca sumę kontrolną SHA256 zawartości zadanego pliku.
// Suma ta jest umieszczana w postaci ciągu znaków w argumencie funkcji zwrotnej.
function sha256(filename, callback) {
  let input = fs.createReadStream(filename);   // Strumień danych.
  let hasher = crypto.createHash("sha256");    // Obiekt wyliczający sumę kontrolną.

  input.on("readable", () => {           // Gdy dane są gotowe do odczytania...
    let chunk;
    while(chunk = input.read()) {        // ...odczytujemy je. Jeżeli metoda zwróci wynik inny niż null...
      hasher.update(chunk);              // ...dane umieszczamy w argumencie metody wyliczającej sumę.
    }                                    // Proces powtarzamy, dopóki w strumieniu są dane.
  });
  input.on("end", () => {                // Gdy zostaną odczytane wszystkie dane, ...
    let hash = hasher.digest("hex");     // ...wyliczamy sumę kontrolną...
    callback(null, hash);                // ...i umieszczamy ją w argumencie funkcji zwrotnej.
  });
  input.on("error", callback);           // W przypadku błędu również wywołujemy funkcję zwrotną.
}

// Kod prostego narzędzia wyliczającego sumę kontrolną pliku.
sha256(process.argv[2], (err, hash) => { // W wierszu polecenia należy umieścić nazwę pliku.
  if (err) {                             // Jeżeli pojawi się błąd...
    console.error(err.toString());       // ...wyświetlamy komunikat.
  } else {                               // W przeciwnym razie...
    console.log(hash);                   // ...wyświetlamy wyliczoną sumę.
  }
});
