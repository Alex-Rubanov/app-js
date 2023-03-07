const http = require("http");

function getJSON(url) {
    // Utworzenie i zwrócenie nowej promesy.
    return new Promise((resolve, reject) => {
        // Wysłanie zapytania HTTP GET na zadany adres URL.
        request = http.get(url, response => { // Funkcja wywoływana z chwilą nadejścia odpowiedzi.
            // Odrzucenie promesy, jeżeli stan HTTP jest niewłaściwy.
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP status ${response.statusCode}`));
                response.resume();  // Zapobieżenie wyciekowi pamięci.
            }
            // Odrzucenie promesy, jeżeli nagłówek odpowiedzi jest niewłaściwy.
            else if (response.headers["content-type"] !== "application/json") {
                reject(new Error("Niewłaściwy nagłówek content-type"));
                response.resume();  // Zapobieżenie wyciekowi pamięci.
            }
            else {
                // Jeżeli wszystko jest dobrze, rejestrujemy zdarzenie inicjujące odczytanie treści odpowiedzi.
                let body = "";
                response.setEncoding("utf-8");
                response.on("data", chunk => { body += chunk; });
                response.on("end", () => {
                    // Po odebraniu całej odpowiedzi analizujemy ją.
                    try {
                        let parsed = JSON.parse(body);
                        // Po pomyślnym przeanalizowaniu odpowiedzi spełniamy promesę.
                        resolve(parsed);
                    } catch(e) {
                        // W przeciwnym razie odrzucamy ją.
                        reject(e);
                    }
                });
            }
        });
        // Odrzucamy promesę również wtedy, gdy nie uda się wysłać zapytania,
        // na przykład z powodu niedostępności sieci.
        request.on("error", error => {
            reject(error);
        });
    });
}
