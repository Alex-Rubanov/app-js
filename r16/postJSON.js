const https = require("https");

/*
 * Funkcja przekształcająca argument 'body' w ciąg JSON i wysyłająca go
 * w zapytaniu HTTPS POST do serwera 'host' na adres wskazany w argumencie
 * 'endpoint'. Funkcja zwraca promesę generującą ciąg znaków zawierający
 * przetworzoną odpowiedź zapisaną w formacie JSON.
*/
function postJSON(host, endpoint, body, port, username, password) {
  // Natychmiastowe zwrócenie obiektu promesy, która zostanie
  // spełniona lub odrzucona, odpowiednio, w przypadku pomyślnego
  // lub niepomyślnego wysłania zapytania HTTPS.
  return new Promise((resolve, reject) => {
    // Przekształcenie obiektu body w ciąg znaków.
    let bodyText = JSON.stringify(body);

    // Przygotowanie zapytania HTTPS.
    let requestOptions = {
      method: "POST",             // Lub "GET", "PUT", "DELETE" itp.
      host: host,                 // Komputer, do którego jest wysyłane zapytanie.
      path: endpoint,             // Adres URL.
      headers: {                  // Nagłówki zapytania HTTP.
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyText)
      }
    };

    if (port) {                          // Jeżeli jest określony argument 'port'...
      requestOptions.port = port;        // ...stosujemy go w zapytaniu.
    }
    // Jeżeli podane są poświadczenia, umieszczamy je w nagłówku Authorization.
    if (username && password) {
      requestOptions.auth = `${username}:${password}`;
    }

    // Przygotowanie obiektu zapytania na podstawie zadanych argumentów.
    let request = https.request(requestOptions);

    // Zapisanie treści zapytania i zamknięcie go.
    request.write(bodyText);
    request.end();

    // Obsługa błędu, np. braku połączenia sieciowego.
    request.on("error", e => reject(e));

    // Przetwarzanie pojawiających się danych odpowiedzi.
    request.on("response", response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Status HTTP ${response.statusCode}`));
        // W tym momencie nie przetwarzamy jeszcze treści, ale aby
        // nie została umieszczona w buforze przełączamy strumień
        // w tryb płynny bez rejestrowania procedury obsługi zdarzenia "data".
        response.resume();
        return;
      }

      // Oczekujemy tekstu, a nie bajtów. Zakładamy, że tekst
      // odpowiedzi jest zapisany w formacie JSON, więc nie sprawdzamy
      // zawartości nagłówka Content-Type.
      response.setEncoding("utf8");

      // Środowisko Node nie pozwala strumieniowo analizować danych
      // JSON, dlatego całą treść odpowiedzi umieszczamy w ciągu znaków.
      let body = "";
      response.on("data", chunk => { body += chunk; });
      // Przetworzenie całej odebranej odpowiedzi.
      response.on("end", () => {                // Gdy zostanie odebrana cała odpowiedź...
        try {                                   // ...analizujemy jej treść zapisaną w formacie JSON...
          resolve(JSON.parse(body));            // ...i determinujemy promesę.
        } catch(e) {                            // Jeżeli coś pójdzie źle...
          reject(e);                            // ...odrzucamy promesę i zgłaszamy błąd.
        }
      });
    });
  });
}
