function counter() {
    let n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    };
}

let c = counter(), d = counter();   // Utworzenie dwóch liczników.
c.count()                           // => 0
d.count()                           // => 0: liczniki funkcjonują niezależnie od siebie.
c.reset();                          // Metody reset() i count() współdzielą ten sam stan.
c.count()                           // => 0: reset licznika c.
d.count()                           // => 1: licznik d nie jest resetowany.
