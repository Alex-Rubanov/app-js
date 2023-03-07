const fs = require("fs");

// Strumieniowa funkcja kopiująca w trybie płynnym plik źródłowy
// o zadanej nazwie do pliku docelowego o zadanej nazwie.
// Po pomyślnym skopiowaniu wywołuje funkcję zwrotną z argumentem null,
// a w przypadku błędu z obiektem Error.
function copyFile(sourceFilename, destinationFilename, callback) {
  let input = fs.createReadStream(sourceFilename);
  let output = fs.createWriteStream(destinationFilename);

  input.on("data", (chunk) => {            // Gdy pojawią się nowe dane...
    let hasRoom = output.write(chunk);     // ...zapisujemy je w strumieniu wyjściowym.
    if (!hasRoom) {                        // Jeżeli wyjściowy bufor jest pełny...
      input.pause();                       // ...wstrzymujemy zapisywanie.
    }
  });
  input.on("end", () => {                  // Gdy zostanie osiągnięty koniec danych...
    output.end();                          // ...zamykamy strumień.
  });
  input.on("error", err => {               // Jeżeli podczas odczytu pojawi się błąd...
    callback(err);                         // ...wywołujemy funkcję zwrotną z obiektem błędu w argumencie...
    process.exit();                        // ...i kończymy działanie.
  });

  output.on("drain", () => {               // Gdy w buforze wyjściowym zrobi się miejsce...
    input.resume();                        // ...wznawiamy obsługę zdarzeń strumienia wejściowego.
  });
  output.on("error", err => {              // Jeżeli podczas zapisu danych pojawi się błąd...
    callback(err);                         // ...wywołujemy funkcję zwrotną z obiektem błędu w argumencie...
    process.exit();                        // ...i kończymy działanie.
  });
  output.on("finish", () => {              // Po zapisaniu wszystkich danych...
    callback(null);                        // ...wywołujemy funkcję zwrotną bez informacji o błędzie.
  });
}

// Kod prostego narzędzia do kopiowania plików.
let from = process.argv[2], to = process.argv[3];
console.log(`Kopiowanie pliku ${from} do ${to}...`);
copyFile(from, to, err => {
  if (err) {
    console.error(err);
  } else {
    console.log("Koniec.");
  }
});
