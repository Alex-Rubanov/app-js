// Nawiązanie połączenia ze wskazanym serwerem i portem.
let socket = require("net").createConnection(6789, process.argv[2]);
socket.pipe(process.stdout);              // Przekierowanie danych z gniazda do wyjścia stdout.
process.stdin.pipe(socket);               // Przekierowanie danych z wejścia stdin do gniazda.
socket.on("close", () => process.exit()); // Wyjście po zamknięciu połączenia.
