/**
* Asynchroniczna funkcja strumieniująca treść zawartą w obiekcie Response
* reprezentującym odpowiedź na zapytanie wysłane za pomocą funkcji fetch().
* W pierwszym argumencie funkcji umieszcza się obiekt Response, a w dwóch
* następnych, opcjonalnych, funkcje zwrotne.
*
* Funkcja umieszczona w argumencie reportProgress jest wywoływana
* po odebraniu kolejnej porcji danych. W jej pierwszym argumencie jest
* umieszczana całkowita liczba odebranych danych, a w drugim liczba
* z przedziału od 0 do 1 oznaczająca stopień zaawansowania pobierania.
* Jeżeli jednak odpowiedź nie ma nagłówka "Content-Length", to
* drugi argument ma wartość NaN.
*
* Aby przetwarzać porcje danych w miarę ich odbierania, należy
* w argumencie processChunk umieścić funkcję. W jej argumencie
* będzie umieszczana porcja danych jako obiekt Uint8Array.
*
* Funkcja streamBody() zwraca promesę reprezentującą ciąg znaków.
* Jeżeli w argumencie processChunk zostanie umieszczona funkcja zwrotna,
* to powyższy ciąg będzie złączeniem wyników zwrócony przez tę
* funkcję zwrotną. W przeciwnym razie ciąg będzie złączeniem porcji
* danych przekształconych w ciągi UTF-8.
*/
async function streamBody(response, reportProgress, processChunk) {
  // Liczba oczekiwanych bajtów lub NaN, jeżeli odpowiedź nie ma nagłówka.
  let expectedBytes = parseInt(response.headers.get("Content-Length"));
  let bytesRead = 0;                         // Liczba dotychczas odebranych bajtów.
  let reader = response.body.getReader();    // Odczytanie bajtów danych.
  let decoder = new TextDecoder("utf-8");    // Konwersja bajtów na tekst.
  let body = "";                             // Odczytany dotychczas tekst.

  while(true) {                                   // Pętla wykonywana do chwili przerwania operacji.
    let {done, value} = await reader.read();      // Odczytanie porcji danych.

    if (value) {                                  // Jeżeli jest to tablica bajtów...
      if (processChunk) {                         // ...i została określona funkcja zwrotna...
        let processed = processChunk(value);      // ...wywołujemy ją z porcją danych.
        if (processed) {
          body += processed;
        }
      } else {                                         // W przeciwnym razie...
        body += decoder.decode(value, {stream: true}); // ...przekształcamy bajty w tekst.
      }

      if (reportProgress) {                       // Jeżeli została określona funkcja zwrotna postępu...
        bytesRead += value.length;
        reportProgress(bytesRead, bytesRead / expectedBytes); // ...wywołujemy ją.
      }
    }
    if (done) {                                   // Jeżeli to jest ostatnia porcja danych...
      break;                                      // ...wychodzimy z pętli.
    }
  }

  return body;     // Zwrócenie scalonego tekstu odpowiedzi.
}
