/*
 * Obiekt Range reprezentuje zakres liczb {x: from <= x <= to}.
 * Definiuje również metodę has() sprawdzającą, czy dana liczba zawiera się w zakresie.
 * Klasa Range jest iterowalna i służy do iterowania wszystkich liczb z zadanego zakresu.
 */
class Range {
    constructor (from, to) {
        this.from = from;
        this.to = to;
    }

    // Utworzenie klasy Range funkcjonującej jak zbiór liczb.
    has(x) { return typeof x === "number" && this.from <= x && x <= this.to; }

    // Metoda zwracająca tekstową reprezentację zakresu w notacji właściwej dla zbioru.
    toString() { return `{ x | ${this.from} ≤ x ≤ ${this.to} }`; }

    // Aby klasa Range była iterowalna musi zwracać obiekt iteratora.
    // Zwróć uwagę, że nazwa tej metody jest specjalnym symbolem.
    [Symbol.iterator]() {
        // Każda instancja iteratora musi funkcjonować niezależnie od innych.
        // Dlatego potrzeba jest zmienna, w której będzie zapisywana pozycja iteracji.
        // Początkową wartością jest pierwsza liczba większa lub równa właściwości from.
        let next = Math.ceil(this.from);  // Następna zwracana wartość.
        let last = this.to;               // Wartość większa niż this.to nie jest zwracana.
        return {                          // Obiekt iteratora.
            // Metoda next() sprawia, że this jest obiektem iteratora
            // i zwraca wynik iteracji.
            next() {
                return (next <= last)   // Jeżeli ostatnia wartość nie została jeszcze zwrócona...
                    ? { value: next++ } // ...zwracamy następną i zwiększamy pozycję.
                    : { done: true };   // W przeciwnym razie informujemy, że to koniec iteracji.
            },

            // Dla wygody można utworzyć iterator, który jest iterowalny.
            [Symbol.iterator]() { return this; }
        };
    }
}

for(let x of new Range(1,10)) console.log(x); // Wyświetlenie liczb od 1 do 10.
[...new Range(-2,2)]                          // => [-2, -1, 0, 1, 2]