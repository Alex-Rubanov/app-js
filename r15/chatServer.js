// Kod serwerowy przeznaczony do uruchomienia w środowisku Node.
// Implementuje bardzo prosty, anonimowy pokój rozmów.
// Nowe komunikaty muszą być wysyłane za pomocą zapytań POST na
// adres /chat. Mogą to być również zapytania GET w formacie text/event-stream.
// Wysłanie zapytania GET na główny adres powoduje odesłanie prostego
// pliku zawierającego kliencki kod czatu.
const http = require("http");
const fs = require("fs");
const url = require("url");

// Kliencki kod HTML czatu.
const clientHTML = fs.readFileSync("chatClient.html");

// Tablica obiektów ServerResponse wykorzystywanych do zgłaszania zdarzeń.
let clients = [];

// Rozpoczęcie nasłuchu na porcie nr 8080.
// W przeglądarce należy otworzyć adres http://localhost:8080.
let server = new http.Server();
server.listen(8080);

// Serwer po odebraniu zapytania wywołuje poniższą funkcję.
server.on("request", (request, response) => {
  // Analiza adresu URL zapytania.
  let pathname = url.parse(request.url).pathname;

  // Jeżeli zapytanie zawiera adres główny, wysyłany jest kod kliencki czatu.
  if (pathname === "/") {    // Zapytanie o kod kliencki czatu.
    response.writeHead(200, {"Content-Type": "text/html"}).end(clientHTML);
  }

  // Jeżeli adres jest inny niż /chat albo metoda jest inna niż GET lub
  // POST, wysyłana jest odpowiedź z kodem 404.
  else if (pathname !== "/chat" ||
      (request.method !== "GET" && request.method !== "POST")) {
    response.writeHead(404).end();
  }
  // Zapytanie GET wysłane na adres /char oznacza, że klient się podłącza.
  else if (request.method === "GET") {
    acceptNewClient(request, response);
  }
  // W przeciwnym razie jest to zapytanie POST zawierające nowy komunikat.
  else {
    broadcastNewMessage(request, response);
  }
});

// Poniższa funkcja obsługuje zapytania GET wysyłane na adres /chat
// przez klienta tworzącego obiekt EventSource (lub gdy ten obiekt
// automatycznie wznawia połączenie).
function acceptNewClient(request, response) {
  // Zapamiętanie obiektu odpowiedzi, aby można go było wykorzystać
  // do wysyłania przyszłych komunikatów.
  clients.push(response);

  // Jeżeli klient zakończy połączenie, odpowiadający mu obiekt
  // jest usuwany z tablicy.
  request.connection.on("end", () => {
    clients.splice(clients.indexOf(response), 1);
    response.end();
  });

  // Ustawienie nagłówków i wysłanie początkowego zdarzenia jednemu klientowi.
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  });
  response.write("event: chat\ndata: Connected\n\n");

  // Zwróć uwagę, że specjalnie nie jest wywoływana metoda response.end().
  // Podtrzymywanie otwartego połączenia jest warunkiem korzystania z protokołu SSE.
}

// Funkcja wywoływana po odebraniu zapytania POST wysłanego na adres /chat
// po wpisaniu przez użytkownika nowego komunikatu.
async function broadcastNewMessage(request, response) {
  // Najpierw odczytujemy treść zapytania i uzyskujemy komunikat.
  request.setEncoding("utf8");
  let body = "";
  for await (let chunk of request) {
    body += chunk;
  }

  // Po odczytanie treści wysyłamy pustą odpowiedź i zamykamy połączenie.
  response.writeHead(200).end();

  // Zapisanie komunikatu w formacie text/event-stream i poprzedzenie
  // każdego wiersza prefiksem "data:".
  let message = "data: " + body.replace("\n", "\ndata: ");

  // Dodanie do komunikatu prefiksu definiującego zdarzenie "chat"
  // i dodanie na końcu dwóch pustych wierszy oznaczających koniec zdarzenia.
  let event = `event: chat\n${message}\n\n`;

  // Wysłanie zdarzenia do wszystkich podłączonych klientów.
  clients.forEach(client => client.write(event));
}
