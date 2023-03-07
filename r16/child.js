// Oczekiwanie na komunikat z procesu nadrzędnego.
process.on("message", message => {
  // Po odebraniu komunikatu wykonujemy obliczenia
  // i wysyłamy wynik do procesu nadrzędnego.
  process.send({hypotenuse: Math.hypot(message.x, message.y)});
});
