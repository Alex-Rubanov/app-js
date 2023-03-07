/**
 * Klasa podobna do Set, ale rejestrująca, ile razy została dodana wartość
 * do zbioru. Posiada metody add() i remove() działające podobnie
 * jak w klasie Set oraz metodę count(), której wynik określa, ile razy
 * została dodana do zbioru zadana wartość. Domyślny iterator zwraca
 * każdą dodaną wartość tylko raz. Metoda entries() służy do iterowania
 * par [wartość, liczba].
 */
class Histogram {
    // Aby zainicjować obiekt, wystarczy oddelegować go do utworzonej instancji klasy Map.
    constructor() { this.map = new Map(); }

    // Metoda count() zwraca liczbę przypisaną zadanemu kluczowi w obiekcie Map
    // lub wartość 0, jeżeli klucza nie ma.
    count(key) { return this.map.get(key) || 0; }

    // Metoda has(), tak jak w klasie Set, zwraca wartość true, jeżeli metoda count() zwraca wynik różny od zera.
    has(key) { return this.count(key) > 0; }

    // Metoda size() zwraca liczbę elementów w obiekcie Map.
    get size() { return this.map.size; }

    // Aby dodać klucz, wystarczy zwiększyć liczbę jego wystąpień w obiekcie Map.
    add(key) { this.map.set(key, this.count(key) + 1); }

    // Usunięcie klucza jest nieco trudniejsze, ponieważ trzeba go usunąć z obiektu Map,
    // jeżeli liczba jego wystąpień zmniejszy się do zera.
    delete(key) {
        let count = this.count(key);
        if (count === 1) {
            this.map.delete(key);
        } else if (count > 1) {
            this.map.set(key, count - 1);
        }
    }

    // Iterator zwraca klucze zapisane w obiekcie Histogram.
    [Symbol.iterator]() { return this.map.keys(); }

    // Inne iteratory są po prostu oddelegowane do obiektu Map.
    keys() { return this.map.keys(); }
    values() { return this.map.values(); }
    entries() { return this.map.entries(); }
}
