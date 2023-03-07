function pipe(readable, writable, callback) {
  // Najpierw implementujemy obsługę błędów.
  function handleError(err) {
    readable.close();
    writable.close();
    callback(err);
  }

  // Następnie definiujemy potok i obsługę normalnego zakończenia operacji.
  readable
    .on("error", handleError)
    .pipe(writable)
    .on("error", handleError)
    .on("finish", callback);
}
