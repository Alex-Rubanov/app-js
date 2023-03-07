// Konstruktor inicjujący nowy obiekt typu Range.
// Zwróć uwagę, że nie tworzy on i nie zwraca obiektu, tylko go inicjuje.
function Range(from, to) {
    // Zapisanie początku i końca zakresu (stanu) nowego obiektu.
    // Są to unikatowe właściwości obiektu, nie odziedziczone po prototypie.
    this.from = from;
    this.to = to;
}

// Wszystkie obiekty będą dziedziczyły cechy obiektu Range.
// Zwróć uwagę, że właściwość musi mieć nazwę "prototype", aby to było możliwe.
Range.prototype = {
    // Metoda zwracająca wartość true, jeżeli x zawiera się w zakresie, lub false w przeciwnym razie.
    // Metoda operuje na zakresach wartości tekstowych, liczbowych i typu Date.
    includes: function(x) { return this.from <= x && x <= this.to; },

    // Funkcja generatora, dzięki której instancje klasy można iterować.
    // Zwróć uwagę, że dotyczy to tylko zakresów liczbowych.
    [Symbol.iterator]: function*() {
        for(let x = Math.ceil(this.from); x <= this.to; x++) yield x;
    },

    // Metoda zwracająca ciąg znaków reprezentujący zakres.
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};
