const fs = require("fs");  // Import modułu odsługującego system plików.

// Funkcja odczytująca plik konfiguracyjny, analizująca jego zawartość zapisaną
// w formacie JSON i umieszczająca wynikowy obiekt w argumencie funkcji
// zwrotnej. Jeżeli pojawi się błąd, funkcja wysyła komunikat do strumienia
// stderr i wywołuje funkcję zwrotną z wartością null w argumencie.
function readConfigFile(path, callback) {
  fs.readFile(path, "utf8", (err, text) => {
    if (err) {        // Coś poszło źle podczas odczytywania pliku.
      console.error(err);
      callback(null);
      return;
    }
    let data = null;
    try {
      data = JSON.parse(text);
    } catch(e) {      // Coś poszło źle podczas analizowania zawartości pliku.
      console.error(e);
    }
    callback(data);
  });
}
