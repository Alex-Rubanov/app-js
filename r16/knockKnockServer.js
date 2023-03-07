// Serwer TCP grający w grę słowną "puk, puk" na porcie 6789.
const net = require("net");
const readline = require("readline");

// Utworzenie obiektu Server i oczekiwanie na połączenie.
let server = net.createServer();
server.listen(6789, () => console.log("Gra puk, puk wykorzystująca port 6789"));

// Po nawiązaniu połączenia z klientem zaczynamy grę.
server.on("connection", socket => {
  tellJoke(socket)
    .then(() => socket.end())      // Po zakończeniu gry zamykamy połączenie.
    .catch((err) => {
      console.error(err);          // Zarejestrowanie błędu, jeżeli się pojawi.
      socket.end();                // Mimo błędu trzeba zamknąć połączenie.
    });
});

// Gry do wyboru:
const jokes = {
  "Sąsiadki": "Nie ma żadnych siatek!",
  "Nożyce": "No, życe ci wszystkiego najlepszego!",
  "Damy": "Damy radę!"
};

// Interaktywny dialog przy życiu gniazda sieciowego i nieblokujących funkcji.
async function tellJoke(socket) {
  // Losowe wybranie jednej gry.
  let randomElement = a => a[Math.floor(Math.random() * a.length)];
  let who = randomElement(Object.keys(jokes));
  let punchline = jokes[who];

  // Odczytanie wpisanego przez użytkownika wiersza za pomocą modułu "readline".
  let lineReader = readline.createInterface({
    input: socket,
    output: socket,
    prompt: ">> "
  });

  // Funkcja pomocnicza wyświetlająca wiersz tekstu,
  // a następnie (domyślnie) znaki zachęty.
  function output(text, prompt=true) {
    socket.write(`${text}\r\n`);
    if (prompt) lineReader.prompt();
  }

  // Gra polega na zadawaniu pytań i udzielaniu odpowiedzi. Użytkownik na kolejnych
  // etapach zadaje pytania, po czym wykonywane są różne operacje.
  let stage = 0;

  // Gra zaczyna się w zwykły sposób.
  output("Puk, puk!");

  // Asynchroniczne odczytywanie pytań użytkownika aż do zakończenia gry.
  for await (let inputLine of lineReader) {
    if (stage === 0) {
      if (inputLine.toLowerCase() === "kto tam?") {
        // Jeżeli użytkownik zadał właściwe pytanie na etapie 0
        // udzielana jest pierwsza odpowiedź i następuje przejście do etapu 1.
        output(who);
        stage = 1;
      } else  {
        // Jeżeli pytanie jest niewłaściwe, wyświetlamy podpowiedź.
        output('Wpisz "Kto tam?".');
      }
    } else if (stage === 1) {
      if (inputLine.toLowerCase() === `Jakie ${who.toLowerCase()}?`) {
        // Jeżeli na etapie 1. użytkownik wpisał właściwe pytanie
        // wyświetlamy drugą odpowiedź i kończymy grę.
        output(`${punchline}`, false);
        return;
      } else {
        // Podpowiedź dla użytkownika.
        output(`Wpisz "Jakie ${who}?"`);
      }
    }
  }
}
