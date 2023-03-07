let uniqueInteger = (function() {  // Zdefiniowane i wywołanie funkcji
    let counter = 0;               // rejestrującej prywatny stan.
    return function() { return counter++; };
}());
uniqueInteger()  // => 0
uniqueInteger()  // => 1
