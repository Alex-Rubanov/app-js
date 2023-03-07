function wait(duration) {
    // Utworzenie i zwrócenie nowej promesy.
    return new Promise((resolve, reject) => { // Argumenty kontrolujące promesę.
        // Jeżeli argument jest błędny, promesa jest odrzucana.
        if (duration < 0) {
            reject(new Error("Podróże w czasie są na razie niemożliwe"));
        }
        // W przeciwnym wypadku czekamy asynchronicznie, a następnie determinujemy promesę.
        // Metoda setTimeout wywoła metodę resolve() bez argumentów, co oznacza,
        // że promesa będzie spełniona z niezdefiniowaną wartością.
        setTimeout(resolve, duration);
    });
}
