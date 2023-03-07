const stream = require("stream");

class GrepStream extends stream.Transform {
  constructor(pattern) {
    super({decodeStrings: false});    // Nie przekształcamy ciągów znaków z powrotem na bajty.
    this.pattern = pattern;           // Wykorzystywane wyrażenie regularne.
    this.incompleteLine = "";         // Fragment ostatniej porcji danych.
  }

  // Metoda wywoływana w chwili, gdy jest gotowy ciąg przeznaczony
  // do przekształcenia. Przetworzone dane umieszcza w argumencie
  // funkcji zwrotnej. W strumieniu wejściowym powinny pojawiać się
  // wyłącznie dane tekstowe, dlatego należy wywołać metodę
  // setEncoding() tego strumienia.
  _transform(chunk, encoding, callback) {
    if (typeof chunk !== "string") {
      callback(new Error("Oczekiwane dane tekstowe, a nie binarne"));
      return;
    }
    // Dodanie fragmentu ostatniego niepełnego wiersza
    // i podzielenie danych na osobne wiersze.
    let lines = (this.incompleteLine + chunk).split("\n");

    // Ostatni element tablicy zawiera nowy, niekompletny wiersz.
    this.incompleteLine = lines.pop();

    // Wyszukanie wszystkich dopasowanych wierszy.
    let output = lines                         // Bierzemy wszystkie pełne wiersze,...
      .filter(l => this.pattern.test(l))       // ...zostawiamy tylko dopasowane...
      .join("\n");                             // ...i łączymy je ze sobą.

    // Jeżeli są dopasowane dane, dodajemy podział wiersza.
    if (output) {
      output += "\n";
    }

    // Funkcję zwrotną trzeba wywoływać nawet wtedy, gdy nie ma danych wyjściowych.
    callback(null, output);
  }

  // Funkcja wywoływana tuż przed zamknięciem strumienia.
  // Jest to okazja do zapisania w nim ostatnich danych.
  _flush(callback) {
    // Jeżeli jest niepełny, ale dopasowany wiersz,
    // umieszczamy go w argumencie funkcji zwrotnej.
    if (this.pattern.test(this.incompleteLine)) {
      callback(null, this.incompleteLine + "\n");
    }
  }
}

// Przy użyciu powyższej klasy można napisać program działający tak jak polecenie grep.
let pattern = new RegExp(process.argv[2]); // Odczytanie wyrażenia regularnego z wiersza poleceń.
process.stdin                              // Otwarcie standardowego wejścia.
  .setEncoding("utf8")                     // Odczytanie danych jako ciągu znaków Unicode.
  .pipe(new GrepStream(pattern))           // Skierowanie danych do obiektu GrepStream.
  .pipe(process.stdout)                    // Wysłanie danych do standardowego wyjścia.
  .on("error", () => process.exit());      // Zakończenie programu po zamknięciu strumienia stdout.
