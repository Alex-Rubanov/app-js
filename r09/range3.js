class Range {
    constructor(from, to) {
        // Zapisanie początku i końca zakresu (stanu) nowego obiektu.
        // Są to unikatowe właściwości obiektu, nie odziedziczone po prototypie.
        this.from = from;
        this.to = to;
    }

    // Metoda zwracająca wartość true, jeżeli x zawiera się w zakresie, lub false w przeciwnym razie.
    // Metoda operuje na zakresach wartości tekstowych, liczbowych i typu Date.
    includes(x) { return this.from <= x && x <= this.to; }

    // Funkcja generatora, dzięki której instancje klasy można iterować.
    // Zwróć uwagę, że dotyczy to tylko zakresów liczbowych.
    *[Symbol.iterator]() {
        for(let x = Math.ceil(this.from); x <= this.to; x++) yield x;
    }

    // Metoda zwracająca ciąg znaków reprezentujący zakres.
    toString() { return `(${this.from}...${this.to})`; }
}
