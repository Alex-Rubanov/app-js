// Funkcja podobna do fetch(), dodająca do obiektu Options właściwość
// timeout i przerywająca zapytanie, jeżeli nie zostanie obsłużone w ciągu
// określonej za pomocą tej właściwości liczby milisekund.
function fetchWithTimeout(url, options={}) {
  if (options.timeout) {    // Jeżeli właściwość timeout istnieje i zawiera wartość różną od zera...
    let controller = new AbortController();      // ...tworzymy obiekt kontrolera...
    options.signal = controller.signal;          // ...i ustawiamy właściwość signal.
    // Uruchomienie czasomierza, który po upływie zadanej liczby milisekund wyśle
    // sygnał przerwania zapytania. Zwróć uwagę, że czasomierz nie jest anulowany.
    // Wywołanie metody abort() po obsłużeniu zapytania nie przynosi żadnego skutku.
    setTimeout(() => { controller.abort(); }, options.timeout);
  }
  // Wysłanie zapytania w zwykły sposób.
  return fetch(url, options);
}
