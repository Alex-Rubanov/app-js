const https = require("https");

// Funkcja odczytująca zawartość strony o zadanym adresie URL i przekazująca ją funkcji zwrotnej.
function getText(url, callback) {
    // Wysłanie zapytania HTTP GET na zadany adres URL.
    request = https.get(url);

    // Zarejestrowanie funkcji obsługującej zdarzenie odpowiedzi.
    request.on("response", response => {
        // Zgłoszenie zdarzenia oznacza, że został odebrany nagłówek odpowiedzi.
        let httpStatus = response.statusCode;

        // Treść odpowiedzi jeszcze nie została odebrana,
        // dlatego trzeba zarejestrować dodatkowe funkcje zwrotne,
        // które zostaną wywołane, gdy nadejdzie odpowiedź.
        response.setEncoding("utf-8");  // Spodziewany jest tekst zakodowany w standardzie Unicode.
        let body = "";                  // Zostanie on umieszony w tej zmiennej.

        // Ta funkcja będzie wywoływana, gdy kolejny fragment odpowiedzi będzie gotowy do odczytu.
        response.on("data", chunk => { body += chunk; });

        // Ta funkcja zostanie wywołana po odebraniu całej odpowiedzi.
        response.on("end", () => {
            if (httpStatus === 200) {   // Jeżeli zapytanie HTTP zostało obsłużone poprawnie,
                callback(null, body);   // treść odpowiedzi jest umieszczana w argumencie funkcji zwrotnej.
            } else {                    // W przeciwnym razie w argumencie jest umieszczany komunikat o błędzie.
                callback(httpStatus, null);
            }
        });
    });

    // Rejestrowana jest również procedura obsługi niskopoziomowych błędów transmisji sieciowej.
    request.on("error", (err) => {
        callback(err, null);
    });
}
