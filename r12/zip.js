// Funkcja zwracająca ułożone naprzemiennie elementy iterowalnych obiektów zawartych w zadanej tablicy.
function* zip(...iterables) {
    // Utworzenie iteratora dla każdego iterowalnego obiektu.
    let iterators = iterables.map(i => i[Symbol.iterator]());
    let index = 0;
    while(iterators.length > 0) {           // Pętla wykonywana dopóki są jakieś iteratory.
        if (index >= iterators.length) {    // Jeżeli został osiągnięty ostatni iterator...
            index = 0;                      // ...następuje powrót do pierwszego.
        }
        let item = iterators[index].next(); // Odczytanie następnego elementu z następnego iteratora.
        if (item.done) {                    // Jeżeli iterator skończył działanie...
            iterators.splice(index, 1);     // ...usuwamy go z tablicy.
        }
        else {                              // W przeciwnym razie...
            yield item.value;               // ...zwracamy odczytaną wartość...
            index++;                        // ...i przechodzimy do następnego iteratora.
        }
    }
}

// Ułożenie na przemian elementów zawartych w trzech obiektach.
[...zip(oneDigitPrimes(),"ab",[0])]     // => [2,"a",0,3,"b",5,7]