// Funkcja zapisująca porcję danych we wskazanym strumieniu
// i zwracająca promesę, która jest spełniana, gdy można zapisywać
// kolejne dane. Dzięki temu funkcję można stosować z instrukcją await.
function write(stream, chunk) {
  // Zapisanie porcji danych we wskazanym strumieniu.
  let hasMoreRoom = stream.write(chunk);
  if (hasMoreRoom) {                       // Jeżeli bufor jest pełny...
    return Promise.resolve(null);          // ...zwracamy spełnioną promesę.
  } else {
    return new Promise(resolve => {        // W przeciwnym razie zwracamy promesę...
      stream.once("drain", resolve);       // ...spełnianą po zgłoszeniu zdarzenia "drain".
    });
  }
}

// Funkcja kopiująca dane ze strumienia źródłowego do docelowego
// z uwzględnieniem nacisku zwrotnego. Wywołanie tej
// funkcji jest podobne go wywołania source.pipe(destination).
async function copy(source, destination) {
  // Rejestracja w strumieniu docelowym procedury obsługi zdarzenia
  // "error" zgłaszanego po niespodziewanym zamknięciu strumienia
  // (na przykład w przypadku skierowania go do polecenia 'head').
  destination.on("error", err => process.exit());

  // Asynchroniczne odczytywanie danych ze strumienia wejściowego za pomocą pętli for/await.
  for await (let chunk of source) {
    // Zapisane danych i oczekiwanie na wolne miejsce w buforze.
    await write(destination, chunk);
  }
}

// Kopiowane danych ze standardowego wejścia do standardowego wyjścia.
copy(process.stdin, process.stdout);
