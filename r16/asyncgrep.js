// Funkcja odczytująca tekst ze strumienia wejściowego i zapisująca
// w strumieniu wyjściowym wiersze dopasowane do zadanego wzorca.
async function grep(source, destination, pattern, encoding="utf8") {
  // Utworzenie strumienia wejściowego przeznaczonego do odczytywania danych tekstowych, a nie binarnych.
  source.setEncoding(encoding);

  // Rejestracja procedury obsługi błędów wywoływanej w przypadku nieoczekiwanego
  // zamknięcia strumienia wyjściowego (np. po przekierowaniu go do polecenia 'head').
  destination.on("error", err => process.exit());

  // Porcja danych raczej nie zawiera na końcu znaku podziału wiersza,
  // tylko część następnego wiersza. Sprawdzamy to tutaj.
  let incompleteLine = "";

  // Pętla for/await odczytująca asynchronicznie porcje danych ze strumienia wejściowego.
  for await (let chunk of source) {
    // Podzielenie połączonej ostatniej i nowej porcji danych na osobne wiersze.
    let lines = (incompleteLine + chunk).split("\n");
    // Ostatni wiersz jest niepełny.
    incompleteLine = lines.pop();
    // Przetworzenie wierszy za pomocą pętli i zapisanie pasujących w strumieniu wyjściowym.
    for(let line of lines) {
      if (pattern.test(line)) {
        destination.write(line + "\n", encoding);
      }
    }
  }
  // Na koniec sprawdzamy, czy pozostały tekst jest dopasowany.
  if (pattern.test(incompleteLine)) {
    destination.write(incompleteLine + "\n", encoding);
  }
}

let pattern = new RegExp(process.argv[2]);   // Odczytanie wyrażenia regularnego z wiersza poleceń.
grep(process.stdin, process.stdout, pattern) // Wywołanie asynchronicznej funkcji grep().
  .catch(err => {                            // Obsługa asynchronicznego wyjątku.
    console.error(err);
    process.exit();
  });
