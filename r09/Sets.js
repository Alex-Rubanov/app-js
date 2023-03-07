/**
 * Klasa AbstractSet definiuje pojedynczą metodę abstrakcyjną has().
 */
class AbstractSet {
    // Zgłoszenie wyjątku, ponieważ podklasa musi definiować własną wersję tej metody.
    has(x) { throw new Error("Metoda abstrakcyjna"); }
}

/**
 * NotSet jest klasą pochodną od AbstractSet. Reprezentuje zbiór elementów,
 * które nie należą do innego zbioru. Ponieważ zbiór jest definiowany na bazie
 * innego zbioru, nie można go modyfikować. Nie można go również
 * iterować, ponieważ liczba jego elementów nie jest określona. Można
 * jedynie sprawdzać, czy należy do niego zadany element i przekształcać zbiór
 * w ciąg znaków, stosując matematyczną składnię.
 */
class NotSet extends AbstractSet {
    constructor(set) {
        super();
        this.set = set;
    }

    // Implementacja odziedziczonej metody abstrakcyjnej.
    has(x) { return !this.set.has(x); }
    // Tutaj nadpisywana jest metoda obiektu Object.
    toString() { return `{ x| x ∉ ${this.set.toString()} }`; }
}

/**
 * Range jest klasą pochodną od AbstractSet. Reprezentuje zbiór
 * wartości z przedziału określonego za pomocą właściwości
 * from oraz to (włącznie). Ponieważ mogą to być liczby
 * zmiennoprzecinkowe, zbiór nie jest wyliczalny i nie ma
 * określonej wielkości.
 */
class RangeSet extends AbstractSet {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
    }

    has(x) { return x >= this.from && x <= this.to; }
    toString() { return `{ x| ${this.from} ≤ x ≤ ${this.to} }`; }
}

/*
 * AbstractEnumerableSet jest klasą pochodną od AbstractSet. Definiuje
 * abstrakcyjny getter zwracający wielkość zbioru oraz abstrakcyjny
 * iterator. Metody te są wykorzystywane w zaimplementowanych
 * metodach isEmpty(), toString() i equals(). Podklasy implementujące
 * iterator, getter i metodę has() dostają powyższe metody w prezencie.
 */
class AbstractEnumerableSet extends AbstractSet {
    get size() { throw new Error("Metoda abstrakcyjna"); }
    [Symbol.iterator]() { throw new Error("Metoda abstrakcyjna"); }

    isEmpty() { return this.size === 0; }
    toString() { return `{${Array.from(this).join(", ")}}`; }
    equals(set) {
        // Jeżeli inny zbiór nie jest typu Enumerable to oznacza, że nie jest zgodny z bieżącym zbiorem.
        if (!(set instanceof AbstractEnumerableSet)) return false;

        // Jeżeli zbiory mają różne wielkości, to oznaczz, że nie są sobie równe.
        if (this.size !== set.size) return false;

        // Przetwarzanie elementów zbioru.
        for(let element of this) {
            // Jeżeli element nie należy do innego zbioru, to oznacza, że zbiory nie są równe.
            if (!set.has(element)) return false;
        }

        // Elementy są zgodne, więc zbiory są sobie równe.
        return true;
    }
}

/*
 * SingletonSet jest klasą pochodną od AbstractEnumerableSet.
 * Reprezentuje zbiór przeznaczony tylko do odczytywania
 * i zawierający tylko jeden element.
 */
class SingletonSet extends AbstractEnumerableSet {
    constructor(member) {
        super();
        this.member = member;
    }

    // Zaimplementowane są trzy metody i odziedziczone są
    // wykorzystujące je implementacje metod isEmpty, equals()
    // oraz toString().
    has(x) { return x === this.member; }
    get size() { return 1; }
    *[Symbol.iterator]() { yield this.member; }
}

/*
 * AbstractWritableSet jest abstrakcyjną podklasą pochodną od
 * AbstractEnumerableSet. Definiuje abstrakcyjne metody insert() i remove()
 * służące do dodawania i usuwania elementów zbioru. Metody te są
 * wykorzystane w implementacjach metod add(), subtract() i intersect().
 * Zwróć uwagę, że interfejs API różni się od interfejsu wbudowanej klasy Set.
 */
class AbstractWritableSet extends  AbstractEnumerableSet {
    insert(x) { throw new Error("Metoda abstrakcyjna"); }
    remove(x) { throw new Error("Metoda abstrakcyjna"); }

    add(set) {
        for(let element of set) {
            this.insert(element);
        }
    }

    subtract(set) {
        for(let element of set) {
            this.remove(element);
        }
    }

    intersect(set) {
        for(let element of this) {
            if (!set.has(element)) {
                this.remove(element);
            }
        }
    }
}

/**
 * BitSet jest klasą pochodną od AbstractWritableSet, zawierającą bardzo
 * oszczędną implementację zbioru o stałej wielkości, którego elementami są
 * liczby nieujemne mniejsze od zadanej wartości maksymalnej.
 */
class BitSet extends AbstractWritableSet {
    constructor(max) {
        super();
        this.max = max;  // Maksymalna liczba całkowita, którą można zapisać.
        this.n = 0;      // Liczba elementów w zbiorze.
        this.numBytes = Math.floor(max / 8) + 1;   // Liczba potrzebnych bajtów.
        this.data = new Uint8Array(this.numBytes); // Bajty.
    }

    // Wewnętrzna metoda sprawdzająca, czy zadana wartość jest poprawnym elementem zbioru.
    _valid(x) { return Number.isInteger(x) && x >= 0 && x <= this.max; }

    // Sprawdzenie, czy zadany bit zadanego bajtu tablicy danych jest ustawiony.
    // Metoda zwraca wartość true lub false.
    _has(byte, bit) { return (this.data[byte] & BitSet.bits[bit]) !== 0; }

    // Czy wartość x znajduje się w zbiorze BitSet?
    has(x) {
        if (this._valid(x)) {
            let byte = Math.floor(x / 8);
            let bit = x % 8;
            return this._has(byte, bit);
        } else {
            return false;
        }
    }

    // Umieszczenie wartości x w zbiorze BitSet.
    insert(x) {
        if (this._valid(x)) {               // Jeżeli wartość jest poprawna,
            let byte = Math.floor(x / 8);   // jest zamieniana na bajt i bit.
            let bit = x % 8;
            if (!this._has(byte, bit)) {             // Jeżeli bit nie został jeszcze ustawiony,
                this.data[byte] |= BitSet.bits[bit]; // to jest ustawiany
                this.n++;                            // i zwiększana jest wielkość zbioru.
            }
        } else {
            throw new TypeError("Niepoprawny element zbioru: " + x );
        }
    }

    // Usunięcie wartości x ze zbioru BitSet. 
    remove(x) {
        if (this._valid(x)) {              // Jeżeli wartość jest poprawna,
            let byte = Math.floor(x / 8);  // wyliczany jest bajt i bit.
            let bit = x % 8;
            if (this._has(byte, bit)) {    // Jeżeli bit jest już ustawiony,
                this.data[byte] &= BitSet.masks[bit];  // to jest kasowany
                this.n--;                              // i pomniejszana jest wielkość zbioru.
            }
        } else {
            throw new TypeError("Niepoprawny element zbioru: " + x );
        }
    }

    // Getter zwracający wielkość zbioru.
    get size() { return this.n; }

    // Iterowanie zbioru polega na sprawdzaniu kolejnych bitów.
    // (Można się postarać i napisać bardziej wydajny kod.)
    *[Symbol.iterator]() {
        for(let i = 0; i <= this.max; i++) {
            if (this.has(i)) {
                yield i;
            }
        }
    }
}

// Kilka wstępnie wyliczonych wartości wykorzystywanych w metodach has(), insert() i remove().
BitSet.bits = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
BitSet.masks = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);
