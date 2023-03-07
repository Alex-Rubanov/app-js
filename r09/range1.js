// Funkcja fabryczna zwracająca nowy obiekt reprezentujący zakres wartości.
function range(from, to) {
    // Za pomocą metody Object.create() jest tworzony obiekt pochodny
    // od zdefiniowanego niżej prototypu. Prototyp, zapisany jako właściwość
    // funkcji, definiuje metody (działanie) wspólne dla wszystkich obiektów.
    let r = Object.create(range.methods);

    // Zapisanie początku i końca zakresu (stanu) nowego obiektu.
    // Są to unikatowe właściwości obiektu, nie odziedziczone po prototypie.
    r.from = from;
    r.to = to;

    // Na koniec zwracany jest nowy obiekt.
    return r;
}

// Poniższy prototyp definiuje metody dziedziczone przez wszystkie obiekty.
range.methods = {
    // Metoda zwracająca wartość true, jeżeli x zawiera się w zakresie, lub false w przeciwnym razie.
    // Metoda operuje na zakresach wartości tekstowych, liczbowych i typu Date.
    includes(x) { return this.from <= x && x <= this.to; },

    // Funkcja generatora, dzięki której instancje klasy można iterować.
    // Zwróć uwagę, że dotyczy to tylko zakresów liczbowych.
    *[Symbol.iterator]() {
        for(let x = Math.ceil(this.from); x <= this.to; x++) yield x;
    },

    // Metoda zwracająca ciąg znaków reprezentujący zakres.
    toString() { return "(" + this.from + "..." + this.to + ")"; }
};
