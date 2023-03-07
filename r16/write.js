function write(stream, chunk, callback) {
  // Zapisane porcji danych we wskazanym strumieniu.
  let hasMoreRoom = stream.write(chunk);

  // Sprawdzenie wyniku zwróconego przez metodę write().
  if (hasMoreRoom) {                    // Jeżeli jest to true,...
    setImmediate(callback);             // ...asynchronicznie wywołujemy funkcję zwrotną.
  } else {                              // Jeżeli jest to false,...
    stream.once("drain", callback);     // ...wywołujemy funkcję zwrotną po zgłoszeniu zdarzenia "drain".
  }
}
