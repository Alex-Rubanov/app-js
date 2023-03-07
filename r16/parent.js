const child_process = require("child_process");

// Uruchomienie w procesie potomnym kodu JavaScript zapisanego w pliku child.js znajdującym się w bieżącym katalogu.
let child = child_process.fork(`${__dirname}/child.js`);

// Wysłanie komunikatu do procesu potomnego.
child.send({x: 4, y: 3});

// Wyświetlenie odpowiedzi procesu potomnego.
child.on("message", message => {
  console.log(message.hypotenuse);   // Powinien pojawić się ciąg "5".
  // Ponieważ wysyłamy jeden komunikat, oczekujemy tylko jednej
  // odpowiedzi. Po jej otrzymaniu wywołujemy funkcję disconnect()
  // w celu zamknięcia połączenia pomiędzy procesem nadrzędnym
  // i potomnym. Dzięki temu oba procesy będą mogły z zwykły
  // sposób zakończyć działanie.
  child.disconnect();
});
