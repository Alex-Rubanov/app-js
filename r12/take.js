// Funkcja zwracająca n elementów zawartych w zadanym iterowalnym obiekcie.
function* take(n, iterable) {
    let it = iterable[Symbol.iterator](); // Utworzenie generatora dla iterowalnego obiektu.
    while(n-- > 0) {           // Pętla wykonująca n obiegów.
        let next = it.next();  // Pobranie następnego obiektu z iteratora.
        if (next.done) return; // Wcześniejszy powrót, jeżeli nie ma więcej wartości.
        else yield next.value; // W przeciwnym razie zwrócenie wartości.
    }
}

// Tablica zawierająca pięć wyrazów ciągu Fibonacciego.
[...take(5, fibonacciSequence())]  // => [1, 1, 2, 3, 5]