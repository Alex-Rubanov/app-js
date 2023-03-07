// Prosty program serwerowy udostępniający pliki zapisane w określonym
// katalogu. Implementuje specjalny adres diagnostyczny /test/mirror
// powodujący zwrócenie wysłanego na niego zapytania.
const http = require("http");   // Jeżeli jest certyfikat, można użyć modułu "https".
const url = require("url");     // Moduł do analizowana adresów URL.
const path = require("path");   // Moduł do przetwarzania ścieżek.
const fs = require("fs");       // Moduł do odczytywania plików.

// Funkcja udostępniająca za pomocą protokołu HTTP i wskazanego portu
// pliki zapisane we wskazanym katalogu.
function serve(rootDirectory, port) {
  let server = new http.Server();    // Utworzenie obiektu serwera.
  server.listen(port);               // Określenie portu.
  console.log("Nasłuch na porcie ", port);

  // Odbierane zapytania są przetwarzane za pomocą poniższej funkcji.
  server.on("request", (request, response) => {
    // Wyodrębnienie głównej części adresu URL
    // (pomijamy dołączone do niego parametry).
    let endpoint = url.parse(request.url).pathname;

    // Jeżeli zapytanie zostało wysłane na adres /test/mirror, odsyłamy je z powrotem.
    // Funkcjonalność ta pozwala sprawdzać nagłówki i treści zapytania.
    if (endpoint === "/test/mirror") {
      // Ustawienie nagłówka odpowiedzi.
      response.setHeader("Content-Type", "text/plain; charset=UTF-8");

      // Ustawienie kodu odpowiedzi.
      response.writeHead(200);        // 200 OK

      // Umieszczenie w odpowiedzi informacji o zapytaniu.
      response.write(`${request.method} ${request.url} HTTP/${
                        request.httpVersion
                     }\r\n`);

      // Dodanie do odpowiedzi nagłówków zapytania.
      let headers = request.rawHeaders;
      for(let i = 0; i < headers.length; i += 2) {
        response.write(`${headers[i]}: ${headers[i+1]}\r\n`);
      }

      // Dopisanie podziału wiersza.
      response.write("\r\n");

      // Treść zapytania umieszczamy w treści odpowiedzi. Ponieważ
      // wykorzystywane są strumienie, możemy użyć potoku.
      request.pipe(response);
    }
    // Jeżeli adres jest inny, udostępniamy plik z lokalnego katalogu.
    else {
      // Powiązanie adresu z plikiem.
      let filename = endpoint.substring(1);       // Usunięcie wiodącego ukośnika.
      // Adres nie może zawierać ciągu "../", ponieważ udostępniony byłby plik
      // spoza wskazanego katalogu, co stanowiłoby zagrożenie bezpieczeństwa.
      filename = filename.replace(/\.\.\//g, "");
      // Przekształcenie ścieżki względnej w bezwzględną.
      filename = path.resolve(rootDirectory, filename);

      // Określenie typu zawartości pliku na podstawie jego rozszerzenia.
      let type;
      switch(path.extname(filename))  {
        case ".html":
        case ".htm": type = "text/html"; break;
        case ".js":  type = "text/javascript"; break;
        case ".css": type = "text/css"; break;
        case ".png": type = "image/png"; break;
        case ".txt": type = "text/plain"; break;
        default:     type = "application/octet-stream"; break;
      }

      let stream = fs.createReadStream(filename);
      stream.once("readable", () => {
        // Gdy strumień jest gotowy do odczytu, ustawiamy nagłówek
        // Content-Type i kod stanu 200 OK. Następnie kierujemy strumień
        // zapytania do strumienia odpowiedzi. Potok automatycznie wywoła
        // metodę response.end() po odebraniu wszystkich danych.
        response.setHeader("Content-Type", type);
        response.writeHead(200);
        stream.pipe(response);
      });

      stream.on("error", (err) => {
        // Błąd podczas otwierania strumienia prawdopodobnie oznacza,
        // że żądany plik nie istnieje lub nie można go odczytać. Wysyłamy
        // wtedy zwykły tekst zawierający komunikat o błędzie i ustawiamy
        // kod 404 stanu odpowiedzi.
        response.setHeader("Content-Type", "text/plain; charset=UTF-8");
        response.writeHead(404);
        response.end(err.message);
      });
    }
  });
}

// Funkcję serve() wywołuje się w wierszu poleceń w następujący sposób:
serve(process.argv[2] || "/tmp", parseInt(process.argv[3]) || 8000);
